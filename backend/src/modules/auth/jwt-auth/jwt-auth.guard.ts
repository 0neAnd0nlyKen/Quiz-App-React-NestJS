import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // npm install @nestjs/passport passport passport-jwt --engine-strict=false
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private reflector: Reflector) {
//     super();
//   }
//   canActivate(
//     context: ExecutionContext,
//   ): Promise<boolean> | boolean | Observable<boolean> {
//     const isPublic = this.reflector.getAllAndOverride('isPublic', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) return true;
//     return super.canActivate(context);
//   }
}
// export class JwtAuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return true;
//   }
// }
