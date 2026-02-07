import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // You'll need this to find users in DB
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    this.logger.log(`Login attempt for email: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    
    if (!user) {
      this.logger.warn(`Login failed: User not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare hashed password
    const isMatch = await bcrypt.compare(pass, user?.password || '');
    
    if (!isMatch) {
      this.logger.warn(`Login failed: Invalid password for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    this.logger.log(`Login successful for user: ${email} (ID: ${user.id})`);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}