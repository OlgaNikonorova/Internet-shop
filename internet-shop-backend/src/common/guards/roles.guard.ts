import { ROLES_KEY } from '@common/decorators/roles.decorator';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/domain/enums/user-role.enum';

type RequestParams = Record<string | symbol, any>;

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this._reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestParams>();

    const user = (request?.user as JwtPayload) ?? undefined;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    return requiredRoles.includes(user.role);
  }
}
