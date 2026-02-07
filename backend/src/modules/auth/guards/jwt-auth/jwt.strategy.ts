import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    this.logger.log(`JWT Strategy initialized successfully`);
  }

  // After decoding the token, this data is attached to req.user
  async validate(payload: any) {
    this.logger.log(`JWT validated for user: ${payload.email} (sub: ${payload.sub}, role: ${payload.role})`);
    return {
      sub: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}