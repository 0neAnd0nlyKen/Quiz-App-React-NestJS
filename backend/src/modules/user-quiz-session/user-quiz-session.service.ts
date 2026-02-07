import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQuizSessions } from './entities/user-quiz-session.entity';
import { Repository } from 'typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';

@Injectable()
export class UserQuizSessionsService {
    constructor(
        @InjectRepository(UserQuizSessions)
        private userQuizSessionsRepository: Repository<UserQuizSessions>,
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private answerRepository: Repository<Answer>,
    ){}

    async findAll(): Promise<UserQuizSessions[]> {
        return this.userQuizSessionsRepository.find({
            relations: ['user', 'quiz'],
        });
    }
    
    async findOne(id: number): Promise<UserQuizSessions | null> {
        return this.userQuizSessionsRepository.findOne({
            where: { id },
            relations: ['user', 'quiz'],
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
        const quiz = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ['questions'],
        });

        if (!quiz) {
            throw new NotFoundException('Quiz not found');
        }

        // Default: 30s per question
        const seconds = (quiz.questions?.length || 0) * 30;

        const session = this.userQuizSessionsRepository.create({
            userId,
            quizId,
            secondsRemaining: seconds,
            currentQuestionIndex: 0,
            score: 0,
            isCompleted: false,
        });

        return this.userQuizSessionsRepository.save(session);
    }

    async findForUserNotCompleted(userId: number): Promise<UserQuizSessions[]> {
        return this.userQuizSessionsRepository.find({
            where: { userId, isCompleted: false },
            relations: ['quiz'],
        });
    }

    async findByUserAndQuiz(userId: number, quizId: number): Promise<UserQuizSessions | null> {
        return this.userQuizSessionsRepository.findOne({
            where: { userId, quizId },
        });
    }

    async syncTimer(userId: number, quizId: number, secondsRemaining: number) {
        const session = await this.findByUserAndQuiz(userId, quizId);
        if (!session) throw new NotFoundException('Session not found');
        session.secondsRemaining = secondsRemaining;
        return this.userQuizSessionsRepository.save(session);
    }

    async finishSession(userId: number, quizId: number) {
        const session = await this.findByUserAndQuiz(userId, quizId);
        if (!session) throw new NotFoundException('Session not found');

        // Calculate score: count answers where userAnswer == question.correctAnswer for this quiz
        const answers = await this.answerRepository.find({
            where: { userId },
            relations: ['question'],
        });

        const score = answers.filter(a => a.question && a.question.quiz && a.question.quiz.id === quizId && a.userAnswer === a.question.correctAnswer).length;

        session.score = score;
        session.isCompleted = true;

        return this.userQuizSessionsRepository.save(session);
    }

    //
}
