import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt-auth/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
        if (!secret) {
          console.warn('JWT_SECRET is not set. Using development fallback secret.');
        }
        return {
          secret: secret || 'dev-secret-change-me',
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),  
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],  
  exports: [AuthService],
})
export class AuthModule {}