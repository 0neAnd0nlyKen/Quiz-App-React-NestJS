import { Body, Controller, Delete, Get, Param, Post, Redirect, Render, Res, HttpRedirectResponse, Req, Query } from '@nestjs/common';

import { Role, Roles } from '../auth/guards/roles/roles.decorator';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../auth/guards/jwt-auth/jwt.strategy';
@Controller('admin/users')
export class UsersAdminController {
    constructor(
        private userService: UsersService,
    ) {}
    @Get('/')
    @Roles(Role.Admin)
    @Render('admin/users') // No need for .hbs extension
    async getUsers(@Query() query  ) {
        const users = await this.userService.findByQuery(query.search || '');
        return { 
            adminName: 'Kendrick', 
            date: new Date().toLocaleDateString(),
            users: users,
            error_msg: query.error_msg,
            success_msg: query.success_msg,
        };
    }    
    @Get('/create')
    @Roles(Role.Admin)
    @Render('admin/user-form') // No need for .hbs extension
    async getCreateUserForm() {
        return {
            adminName: 'Kendrick',
            date: new Date().toLocaleDateString(),
        };
    }
    @Post('/create')
    @Roles(Role.Admin)
    async createUser(@Body() body: CreateUserDto, @Res() res): Promise<HttpRedirectResponse> {
        const users = await this.userService.create(body);
        return res.redirect(`/admin/users?success_msg=User with ID ${users.id} created successfully`);
    }    
    @Get('/:id/edit')
    @Roles(Role.Admin)
    async getUser(@Param('id') id: number, @Req() req: any, @Res() res: any) {
        const currentAdmin : JwtPayload= req.user;
        const currentAdminId = Number(currentAdmin.id);
        id = Number(id);
        console.log('Updating user with ID:', id);
        console.log('logged in admin id:', currentAdminId);
        if (id === currentAdminId) {
            console.log('Admins cannot edit their own accounts here.');
            return res.redirect('/admin/users?error_msg=Cannot edit own account');
        }
        const user = await this.userService.findOne(id);
        return res.render('admin/user-form', { 
            adminName: 'Kendrick', 
            date: new Date().toLocaleDateString(),
            user: user,
            currentAdminId: currentAdminId,
        });
    }    
    @Post('/:id/edit')
    @Roles(Role.Admin)
    async updateUser (
        @Param('id') id: number, 
        @Body() body: CreateUserDto, 
        @Res() res: any , 
        @Req() req: any
    ) : Promise<HttpRedirectResponse> {
        const currentAdminId = Number(req.user.id);
        id = Number(id);
        if (id === currentAdminId) {
            console.log('Admins cannot edit their own accounts here.');
            return res.redirect('/admin/users?error_msg=Cannot edit own account');
        }
        const user = await this.userService.update(id, body);
        return res.redirect(`/admin/users?success_msg=User ID ${id} updated successfully`);
    }
    @Delete('/:id/delete')
    @Roles(Role.Admin)
    @Redirect('/admin/users')
    async deleteUser (@Param('id') id: number, @Res() res: any, @Req() req: any) {
        const currentAdminId = Number(req.user.id);
        id = Number(id);
        if (id === currentAdminId) {
            console.log('Admins cannot delete their own accounts here.');
            return res.redirect('/admin/users?error_msg=Cannot delete own account');
        }
        const user = await this.userService.delete(id);
        return res.redirect(`/admin/users?success_msg=User ID ${id} deleted successfully`);
    }    
}