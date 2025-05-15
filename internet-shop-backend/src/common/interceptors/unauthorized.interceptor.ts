import { AuthService } from '@app/auth/auth.service';
import { IAuthService } from '@interfaces/auth.service.interface';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
  constructor(
    @Inject(AuthService)
    private readonly _authService: IAuthService,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      catchError((error: HttpException) => {
        if (error instanceof UnauthorizedException) {
          return this.handleUnauthorized(request, error);
        }

        return throwError(error);
      }),
    );
  }

  private handleUnauthorized(req: Request, error: HttpException) {
    const payload = req.user as JwtPayload | undefined;
    const userId = payload?.sub;

    if (userId) {
      this._authService.logout(userId);
    }

    return throwError(() => new UnauthorizedException(error));
  }
}
