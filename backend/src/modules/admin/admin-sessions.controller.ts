import { Body, Controller, Delete, Get, Param, Post, Redirect, Render, Res, HttpRedirectResponse, Query } from '@nestjs/common';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';
import { QuizService } from '../quiz/quiz.service';
import { UserQuizSessionsService } from '../user-quiz-session/user-quiz-session.service';
import { CreateSessionDto } from '../user-quiz-session/dto/create-session.dto';
import { UsersService } from '../users/users.service';
@Controller('admin/sessions')
export class SessionsAdminController {
    constructor(
        private sessionService: UserQuizSessionsService,
        private quizService: QuizService,
        private userService: UsersService,
    ) {}
    @Get('/')
    @Roles(Role.Admin)
    @Render('admin/sessions') // No need for .hbs extension
    async getSessions(@Query() query) {
        const sessions = await this.sessionService.findAll();
        const users = await this.userService.findAll();
        return { 
            adminName: 'Kendrick', 
            date: new Date().toLocaleDateString(),
            sessions: sessions,
            users: users,
            error_msg: query.error_msg,
            success_msg: query.success_msg,
        };
    }    
    @Get('/create')
    @Roles(Role.Admin)
    @Render('admin/sessions-form') // No need for .hbs extension
    async getCreateSessionForm() {
        const quizzes = await this.quizService.findAll();
        const users = await this.userService.findAll();
        return {
            adminName: 'Kendrick',
            date: new Date().toLocaleDateString(),
            quizzes: quizzes,
            users: users,
        };
    }
    @Post('/create')
    @Roles(Role.Admin)
    async createSession(@Body() body: CreateSessionDto, @Res() res): Promise<HttpRedirectResponse> {
        const sessions = await this.sessionService.create(body);
        return res.redirect(`/admin/sessions?success_msg=Session with ID ${sessions.id} created successfully`);
    }    
    @Get('/:id/edit')
    @Roles(Role.Admin)
    @Render('admin/sessions-form') // No need for .hbs extension
    async getSession(@Param('id') id: number) {
        const session = await this.sessionService.findOne(id);
        const quizzes = await this.quizService.findAll();
        const users = await this.userService.findAll();
        return { 
            adminName: 'Kendrick', 
            date: new Date().toLocaleDateString(),
            session: session,
            quizzes: quizzes,
            users: users,
        };
    }    
    @Post('/:id/edit')
    @Roles(Role.Admin)
    async updateSession (@Param('id') id: number, @Body() body: CreateSessionDto, @Res() res: any): Promise<HttpRedirectResponse> {
        const sessions = await this.sessionService.update(id, body);
        return res.redirect(`/admin/sessions?success_msg=Session with ID ${id} updated successfully`);
    }
    @Delete('/:id/delete')
    @Roles(Role.Admin)
    @Redirect('/admin/sessions')
    async deleteSession(@Param('id') id: number, @Res() res: any) {
        await this.sessionService.delete(id);
        return res.redirect(`/admin/sessions?success_msg=Session ID ${id} deleted successfully`);
    }    
}