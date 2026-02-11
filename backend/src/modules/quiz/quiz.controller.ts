import { Controller, Get, UseGuards, Request, Body, Post, UsePipes, ValidationPipe, Param, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from '../auth/dto/create-quiz.dto';
import { Public } from '../auth/guards/public.decorator';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}
    @Public()
    @Get()
    // @UseGuards(JwtAuthGuard)
    getQuiz(@Request() req, @Query('name') name?: string) {
        if (name) return this.quizService.search(name);
        return this.quizService.findAll();
    }
    
    @Public()
    @Get(':id')
    getQuizById(@Request() req, @Param('id') id: number) {
        return this.quizService.findOne(id);
    }


    @Get(':id/questions')
    @Roles(Role.Admin)
    getQuizQuestions(@Request() req, @Param('id') id: number) {
        return this.quizService.getQuestions(id);
    }


    @Roles(Role.Admin)
    @Post()
    @UsePipes(new ValidationPipe())
    async register(@Body() createQuizDto: CreateQuizDto) {
        return this.quizService.create({
            ...createQuizDto,
        });
    }
    
    @Roles(Role.Admin)
    @Post('update/:id')
    async update(@Param('id') id: number, @Body() updateQuizDto: CreateQuizDto) {
        return this.quizService.update(id, updateQuizDto);
    }
    
    @Roles(Role.Admin)
    @Post('delete/:id')
    async delete(@Param('id') id: number) {
        return this.quizService.delete(id);
    }

}