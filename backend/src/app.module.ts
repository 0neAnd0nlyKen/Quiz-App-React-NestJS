import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtStrategy } from './modules/auth/jwt-auth/jwt.strategy';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuestionsService } from './modules/questions/questions.service';
import { QuestionsController } from './modules/questions/questions.controller';
import { QuestionsModule } from './modules/questions/questions.module';
import { QuizController } from './modules/quiz/quiz.controller';
import { QuizService } from './modules/quiz/quiz.service';
import { AnswersModule } from './modules/answers/answers.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
  ],
  // providers: [
  //   AppService,
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
  // ],
  controllers: [AppController],
  providers: [
    AppService,
    // JwtStrategy
    // {
    //   provide: 'APP_GUARD',
    //   useClass: JwtAuthGuard,
    // }
  ],
})
export class AppModule {}