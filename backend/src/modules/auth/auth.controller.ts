import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe, Logger, Res } from '@nestjs/common';
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
  async login(
    @Body() loginDto: Record<string, any>,
    @Res({ passthrough: true }) res: any // 🍪 Inject the Response object
  ) {
    try {
    const result = await this.authService.login(loginDto.email, loginDto.password);

    res.cookie('access_token', result.access_token, {
      httpOnly: true, // 🛡️ Security: JS cannot steal this token
      secure: false,  // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour in milliseconds
    });

    return res.redirect('/admin/dashboard'); 
    
  } catch (err) {
    return res.render('admin/login', { error: 'Invalid Credentials' });
  }
  }  

  @Post('register')
  //example request body: { "email": "test@example.com", "password": "password123", "display_name": "Test User" }
  // @UsePipes(new ValidationPipe())
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
    // return token in response as key "access_token"
  }
}