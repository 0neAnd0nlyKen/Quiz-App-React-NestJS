import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from './guards/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService, 
    private usersService: UsersService  
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: Record<string, any>) {
    this.logger.debug(`Login request received for email: ${loginDto.email}`);
    // In a real app, use a DTO (Data Transfer Object) for validation
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Registration attempt for email: ${createUserDto.email}`);
    // Hash password before saving!
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const result = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    this.logger.log(`User registered successfully: ${createUserDto.email} (ID: ${result.id})`);
    return result;
  }
}