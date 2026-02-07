import { Module } from '@nestjs/common';
import { UserQuizSessionController } from './user-quiz-session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuizSessions } from './entities/user-quiz-session.entity';
import { UserQuizSessionsService } from './user-quiz-session.service';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserQuizSessions, Quiz, Question, Answer])
  ],
  controllers: [UserQuizSessionController],
  providers: [UserQuizSessionsService],
  exports: [UserQuizSessionsService],
})
export class UserQuizSessionModule {}
