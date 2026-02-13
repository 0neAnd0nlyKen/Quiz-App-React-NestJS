import { Body, Controller, Get, Param, Post, Query, Render, Res } from '@nestjs/common';
import { Public } from '../auth/guards/public.decorator';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
export class AdminController {
    @Get('login')
    @Public()
    @Render('admin/login') // No need for .hbs extension
    async getLogin() {
        return{
            layout: false,
        };
    }   
    @Post('login')
    @Public()
    async login(@Body() body, @Res() res) {
        const login = await this.authService.login(body.email, body.password); 
        if (login && login.access_token) {
            res.cookie('access_token', login.access_token, { httpOnly: true });
            return res.redirect('/admin/dashboard');
        } else {
            return res.render('admin/login', { error_msg: 'Invalid email or password' });
        }
    }   
}
