import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { Observable } from 'rxjs';
import { Role, ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // this.logger.debug('No roles required for this route');
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();
    const userId = user?.sub || user?.userId;
    const hasRequiredRole = requiredRoles.some((role) => user.role?.includes(role));

    if (!hasRequiredRole) {
      // this.logger.warn(`Role authorization failed: User ${user.email} (ID: ${userId}) with role [${user.role}] cannot access route requiring roles [${requiredRoles.join(', ')}]`);
      throw new ForbiddenException('Insufficient permissions');
    }

    // this.logger.log(`Role authorization successful: User ${user.email} (ID: ${userId}) with role [${user.role}] granted access`);
    return true;
  }

}
