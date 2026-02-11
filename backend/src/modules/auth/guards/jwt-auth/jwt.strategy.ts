import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    // console.log(`JWT Strategy constructor called`);
    // console.log(`JWT_SECRET env var: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
    // console.log(`Using secret: ${secret?.substring(0, 10)}...`);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    // this.logger.log(`JWT Strategy initialized successfully`);
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