import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Request} from 'express';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // After decoding the token, this data is attached to req.user
  async validate(payload: any): Promise<JwtPayload> {
    // this.logger.log(`JWT validated for user: ${payload.email} (sub: ${payload.sub}, role: ${payload.role})`);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    /**
     * access via req.user in controllers
     */
  }
}