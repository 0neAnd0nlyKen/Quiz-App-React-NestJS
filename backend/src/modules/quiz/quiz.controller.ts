import { Controller, Get, UseGuards, Request, Body, Post, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from '../auth/dto/create-quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}

    @Get()
    // @UseGuards(JwtAuthGuard)
    getQuiz(@Request() req) {
        return this.quizService.findAll();
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async register(@Body() createQuizDto: CreateQuizDto) {
        return this.quizService.create({
            ...createQuizDto,
        });
    }

    @Post('update/:id')
    async update(@Param('id') id: number, @Body() updateQuizDto: CreateQuizDto) {
        return this.quizService.update(id, updateQuizDto);
    }

    @Post('delete/:id')
    async delete(@Param('id') id: number) {
        return this.quizService.delete(id);
    }

}