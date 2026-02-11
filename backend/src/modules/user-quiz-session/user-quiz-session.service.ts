import { Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sessionStatus, UserQuizSessions } from './entities/user-quiz-session.entity';
import { Repository } from 'typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';
import { BatchAnswersDto } from '../answers/dto/create-answer.dto';
import { AnswersService } from '../answers/answers.service';
import { QuizService } from '../quiz/quiz.service';
import { QuestionsService } from '../questions/questions.service';
@Injectable()
export class UserQuizSessionsService {
    constructor(
        @InjectRepository(UserQuizSessions)
        private userQuizSessionsRepository: Repository<UserQuizSessions>,
        private readonly answersService: AnswersService,
        private readonly quizzesService: QuizService,
    ){}
    private readonly logger = new Logger();
    
    async findAll(): Promise<UserQuizSessions[]> {
        return this.userQuizSessionsRepository.find({
            relations: [ 'quiz'],
        });
    }
    
    async findOne(id: number): Promise<UserQuizSessions | null> {
        return this.userQuizSessionsRepository.findOne({
            where: { id },
            relations: [ 'quiz'],
        });
    }
    
    async create(userQuizSessionData: Partial<UserQuizSessions>): Promise<UserQuizSessions> {
        const userQuizSession = this.userQuizSessionsRepository.create(userQuizSessionData);
        return this.userQuizSessionsRepository.save(userQuizSession);
    }
    
    async update(id: number, updateData: Partial<UserQuizSessions>): Promise<UserQuizSessions> {
        await this.userQuizSessionsRepository.update(id, updateData);
        return this.findOne(id) as Promise<UserQuizSessions>;
    }
    
    async delete(id: number): Promise<void> {
        await this.userQuizSessionsRepository.delete(id);
    }

    // Create a session for a user when they accept a quiz
    async createForUser(userId: number, quizId: number): Promise<UserQuizSessions> {
        const quiz = await this.quizzesService.findOne(quizId);

        if (!quiz) {
            throw new NotFoundException('Quiz not found');
        }

        const existingSession = await this.findByUserAndQuiz(userId, quizId);
        if (existingSession) {
            return existingSession;
        }

        // Default: 30s per question
        const seconds = (quiz.questions?.length || 0) * 30;

        const session = this.userQuizSessionsRepository.create({
            userId,
            quizId,
            secondsRemaining: seconds,
            currentQuestionIndex: 0,
            score: 0,
            status: sessionStatus.PENDING,
        });

        return this.userQuizSessionsRepository.save(session);
    }

    async findByUserAndQuiz(userId: number, quizId: number): Promise<UserQuizSessions | null> {
        return this.userQuizSessionsRepository.findOne({
            where: { userId, quizId },
        });
    }

    async findUserSessions(userId: number, status?: sessionStatus): Promise<UserQuizSessions[]> {
        const whereClause: any = { userId };
        if (status) {
            whereClause.status = status;
        }
        return this.userQuizSessionsRepository.find({
            where: whereClause,
            relations: ['quiz'],
        });
    }

    async findActiveSession(userId: number, quizId: number): Promise<UserQuizSessions | null> {
        return this.userQuizSessionsRepository.findOne({
            where: { userId, quizId, status: sessionStatus.PENDING },
            relations: ['quiz'],
        });
    }// userId will never be different from logged in user!

    async startSession(sessionId: number, userId: number) {
        const session = await this.findOne(sessionId);
        if (!session) throw new NotFoundException('Session not found');

        const status = session.status;
        if (status === sessionStatus.COMPLETED) {
            throw new Error('Session already completed');
        }
        if (status === sessionStatus.IN_PROGRESS) {
            throw new Error('Session already in progress');
        }
        session.status = sessionStatus.IN_PROGRESS;
        await this.userQuizSessionsRepository.save(session);
        const quiz = await this.quizzesService.findOne(session.quizId);
        const questions = await this.quizzesService.getQuestions(session.quizId);
        return { session, quiz, questions };
    }
    
    // Sync timer by session id
    async syncBySessionId(sessionId: number, userId: number, answers: BatchAnswersDto) {
        const session = await this.findOne(sessionId);
        if (!session) throw new NotFoundException('Session not found');

        if (userId && session.userId !== userId) {
            throw new UnauthorizedException('Unauthorized to sync this session');
        }

        const status = session.status;
        if (status !== sessionStatus.IN_PROGRESS) {
            throw new Error('Session not in progress');
        }

        const now = new Date();
        const lastUpdated = session.updatedAt || now;
        const elapsedSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

        if (answers && answers.answers && answers.answers.length > 0) {
            await this.answersService.createBulk(answers.answers);
        }
        session.secondsRemaining -= elapsedSeconds;
        session.updatedAt = now;
        session.status = sessionStatus.PENDING;
        return this.userQuizSessionsRepository.save(session);
    }

    // Resume: return current timer, questions, and previously saved answers
    async resumeSession(sessionId: number, userId: number) {
        const session = await this.findOne(sessionId);
        if (!session) throw new NotFoundException('Session not found');
        // console.log('Resuming session of', session.userId, 'for user', userId);
        if (session.userId !== userId) throw new UnauthorizedException('Unauthorized user for this session!');

        const quiz = await this.quizzesService.findOne(session.quizId);
        const questions = await this.quizzesService.getQuestions(session.quizId);
        const answers = await this.answersService.findByUser(session.userId);

        return { session, quiz, questions, answers };
    }

    // Finish by session id: wrapper that uses existing finishSession
    async finishBySessionId(sessionId: number, userId: number, answers: BatchAnswersDto) {
        const session = await this.findActiveSession(userId, sessionId);
        if (!session) throw new NotFoundException('Session not found');
        if (session.userId !== userId) throw new UnauthorizedException('Unauthorized to finish this session');
        
        session.status = sessionStatus.COMPLETED;
        session.score = await this.calculateScore(session);

        //save answers with this.answersService.createBulk and if some answers failed, handle it gracefully
        if (answers && answers.answers && answers.answers.length > 0) {
            await this.answersService.createBulk(answers.answers);
        }
        return this.userQuizSessionsRepository.save(session);
    }

    async calculateScore(session: UserQuizSessions): Promise<number> {
        if (!session) throw new NotFoundException('Session not found');
        const answers = await this.answersService.findByUser(session.userId);
        const correctAnswers = answers.filter(a => 
            a.question && 
            a.question.quiz && 
            a.question.quiz.id === session.quizId && 
            a.userAnswer === a.question.correctAnswer
        ).length;
        const score = answers.length > 0 ? (correctAnswers / answers.length * 100) : 0;
        return score;
    }

}
