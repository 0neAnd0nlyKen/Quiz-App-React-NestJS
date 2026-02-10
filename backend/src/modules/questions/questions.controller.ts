import { Controller, Get, Post, Body, Put, Delete, Param, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';

@Controller('questions')
@Roles(Role.Admin)
export class QuestionsController {
    constructor(private questionsService: QuestionsService) {}

    @Get()
    async findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const question = await this.questionsService.findOne(Number(id));
        if (!question) {
            throw new BadRequestException('Question not found');
        }
        return question;
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionsService.create({
            text: createQuestionDto.text,
            correctAnswer: createQuestionDto.correctAnswer as boolean,
            quiz: { id: createQuestionDto.quizId } as Quiz, 
        });
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updateQuestionDto: CreateQuestionDto) {
        const updateData = {
            text: updateQuestionDto.text,
            correctAnswer: updateQuestionDto.correctAnswer,
            // Match the entity property name 'quiz'
            quiz: { id: updateQuestionDto.quizId } as Quiz,
        };
        return this.questionsService.update(Number(id), updateData);
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.questionsService.delete(Number(id));
        return { message: 'Question deleted successfully' };
    }
}
