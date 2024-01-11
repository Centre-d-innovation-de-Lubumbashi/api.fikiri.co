import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IS_PUBLIC } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ]) || false;
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const isAuth = request.isAuthenticated();
    if (isAuth) {
      return true;
    }
    throw new ForbiddenException({
      message: 'Veuillez vous connecter',
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}
