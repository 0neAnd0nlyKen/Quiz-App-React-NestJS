import { Body, Controller, Delete, Get, Param, Post, Redirect, Render, Res, HttpRedirectResponse, Query } from '@nestjs/common';

import { QuizService } from '../quiz/quiz.service';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';
import { CreateQuizDto } from '../auth/dto/create-quiz.dto';
import { error } from 'console';
@Controller('admin/quizzes')
export class quizAdminController {
    constructor(
        private quizService: QuizService,
    ) {}
    @Get('/')
    @Roles(Role.Admin)
    @Render('admin/quiz') // No need for .hbs extension
    async getQuizzes(@Query() query) {
        const quizzes = await this.quizService.findAll();
        return { 
            adminName: 'Kendrick', 
            date: new Date().toLocaleDateString(),
            quizzes: quizzes,
            error_msg: query.error_msg,
            success_msg: query.success_msg,
        };
    }    
    @Get('/create')
    @Roles(Role.Admin)
    @Render('admin/quiz-form') // No need for .hbs extension
    async getCreateQuizForm() {
        return {
            adminName: 'Kendrick',
            date: new Date().toLocaleDateString(),
        };
    }
    @Post('/create')
    @Roles(Role.Admin)
    @Render('admin/quiz') // No need for .hbs extension
    async createQuiz(@Body() body: CreateQuizDto, @Res() res): Promise<HttpRedirectResponse> {
        const quizzes = await this.quizService.create(body);
        return res.redirect(`/admin/quizzes?success_msg=Quiz with ID ${quizzes.id} created successfully`);
    }    
    @Get('/:id/edit')
    @Roles(Role.Admin)
    @Render('admin/quiz-form') // No need for .hbs extension
    async getQuiz(@Param('id') id: number) {
        const quiz = await this.quizService.findOne(id);
        return { 
            adminName: 'Kendrick', 
            date: new Date().toLocaleDateString(),
            quiz: quiz,
        };
    }    
    @Post('/:id/edit')
    @Roles(Role.Admin)
    async updateQuiz (@Param('id') id: number, @Body() body: CreateQuizDto, @Res() res: any): Promise<HttpRedirectResponse> {
        const quiz = await this.quizService.update(id, body);
        return res.redirect(`/admin/quizzes?success_msg=Quiz with ID ${id} updated successfully`);
    }
    @Delete('/:id/delete')
    @Roles(Role.Admin)
    @Redirect('/admin/quizzes')
    async deleteQuiz (@Param('id') id: number, @Res() res: any) {
        const quiz = this.quizService.delete(id);
        return res.redirect(`/admin/quizzes?success_msg=Quiz with ID ${id} deleted successfully`);
    }    
}