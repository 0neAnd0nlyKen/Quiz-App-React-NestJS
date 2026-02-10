import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserQuizSessionsService } from './modules/user-quiz-session/user-quiz-session.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './modules/auth/guards/roles/roles.guard';
import { UserQuizSessionModule } from './modules/user-quiz-session/user-quiz-session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, 
      ssl: { rejectUnauthorized: false }, 
    }),
    AuthModule,
    UsersModule,
    QuizModule,
    QuestionsModule,
    AnswersModule,
    UserQuizSessionModule,
  ],
  controllers: [
    AppController, 
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },    
  ],
})
export class AppModule {}