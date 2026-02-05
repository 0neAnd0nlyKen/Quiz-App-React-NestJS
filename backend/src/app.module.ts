import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionsService } from './modules/questions/questions.service';
import { QuestionsController } from './modules/questions/questions.controller';
import { QuestionsModule } from './modules/questions/questions.module';
import { QuizController } from './modules/quiz/quiz.controller';
import { QuizService } from './modules/quiz/quiz.service';
import { AnswersModule } from './modules/answers/answers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // Set to false in production, but true now to create tables
      ssl: { rejectUnauthorized: false }, // Required for many cloud DBs
    }),
    AuthModule,
    UsersModule,
    QuizModule,
    QuestionsModule,
    AnswersModule,
  ],
  controllers: [
    AppController, 
    // QuestionsController,
    // QuizController
  ],
  providers: [
    AppService, 
    // QuestionsService,
    // QuizService
  ],
})
export class AppModule {}