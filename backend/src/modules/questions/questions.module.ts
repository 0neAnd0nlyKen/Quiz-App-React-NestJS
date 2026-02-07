import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Question } from './entities/question.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Question]) // Registers the entity
    ],
    controllers: [QuestionsController],
    providers: [QuestionsService],
    exports: [QuestionsService],
})
export class QuestionsModule {}
