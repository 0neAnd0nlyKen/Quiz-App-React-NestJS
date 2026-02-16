import { Body, Controller, Get, Post, UsePipes, ValidationPipe, Param, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
//useguard
    // @UseGuards(JwtAuthGuard)
    // @UseGuards(AuthGuard('jwt'))
    // add param to filter user by email or username 
    @Get(':query')
    @Roles(Role.Admin)
    findAll(@Param('query') query: string) {
        return this.usersService.findByQuery(query);
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
        const parsed = parseInt(id);
        return this.usersService.findOne(parsed);
    }
    
    @Post()
    @Roles(Role.Admin)
    @UsePipes(new ValidationPipe())
    async register(@Body() createUserDto: CreateUserDto, @Req() req) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        }, req.user?.role);
    }
    
    @Post('delete/:id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        const parsed = parseInt(id);
        // if (Number.isNaN(parsed)) throw new BadRequestException('Invalid id');
        return this.usersService.delete(parsed);
    }
    
    @Post('update/:id')
    async update(@Param('id') id: string, @Body() updateData: Partial<CreateUserDto>) {
        const parsed = parseInt(id);
        // if (Number.isNaN(parsed)) throw new BadRequestException('Invalid id');
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        return this.usersService.update(parsed, updateData);
    }   
}
