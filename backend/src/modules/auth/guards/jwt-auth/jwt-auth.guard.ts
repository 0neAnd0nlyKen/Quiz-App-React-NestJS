import { 
  ExecutionContext, 
  Injectable, 
  Logger, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public route accessed, skipping JWT validation');
      return true;
    }

    this.logger.debug('Validating JWT token');    
  	return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.debug('JWT Auth Guard - handleRequest called');
    this.logger.debug(`err: ${err?.message || 'none'}, user: ${user ? 'present' : 'null'}, info: ${info?.message || 'none'}`);

    if (err) {
      this.logger.error(`JWT validation error: ${err.message}`, err.stack);
    }

    if (user) {
      this.logger.log(`User authorized successfully: ${user.email} (ID: ${user.sub || user.userId})`);
    }

    if (!user) {
      const reason = info?.message || 'Unknown reason';
      this.logger.warn(`JWT validation failed: ${reason}`);
      if (info) {
        this.logger.debug(`JWT error details:`, info);
      }
    }

    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
