import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AnswersModule } from '../answers/answers.module';
import { QuestionsModule } from '../questions/questions.module';
import { QuizModule } from '../quiz/quiz.module';
import { UsersModule } from '../users/users.module';
import { UserQuizSessionModule } from '../user-quiz-session/user-quiz-session.module';
import { quizAdminController } from './admin-quizzes.controller';
import { UsersAdminController } from './admin-users.controller';
import { SessionsAdminController } from './admin-sessions.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        UsersModule,
        QuizModule,
        QuestionsModule,
        AnswersModule,
        UserQuizSessionModule,
        AuthModule,
    ],
    controllers: [
        AdminController,
        quizAdminController,
        UsersAdminController,
        SessionsAdminController
    ],
    providers: [],
})
export class AdminModule {}
