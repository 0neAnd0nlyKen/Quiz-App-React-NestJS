import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private usersService: UsersService  
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: Record<string, any>) {
    // In a real app, use a DTO (Data Transfer Object) for validation
    return this.authService.login(loginDto.email, loginDto.password);
  }
  @Post('register')
  async register(@Body() createUserDto: any) {
    // Hash password before saving!
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}