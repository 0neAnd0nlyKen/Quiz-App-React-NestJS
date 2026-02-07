import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Quiz } from './entities/quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuizSessions } from '../user-quiz-session/entities/user-quiz-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, UserQuizSessions]) // Registers the entity
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
