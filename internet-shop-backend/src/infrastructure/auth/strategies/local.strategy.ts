import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '@interfaces/auth.service.interface';
import { AuthService } from '@app/auth/auth.service';
import { JwtPayload } from '@interfaces/jwt-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService)
    private readonly _authService: IAuthService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<JwtPayload> {
    const user = await this._authService.validateUser({ username, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
