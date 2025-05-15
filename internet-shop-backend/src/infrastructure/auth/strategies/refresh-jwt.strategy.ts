import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { Request } from 'express';
import { RefreshTokenDto } from '@dto/auth/refresh-token.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly _configService: ConfigService,

    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: _configService.get('REFRESH_TOKEN_SECRET') as string,
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<JwtPayload & { refreshToken: string }> {
    console.log(req.body, payload);

    const refreshToken = (req.body as RefreshTokenDto)?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const user = await this._usersRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { ...payload, jti: payload.jti, refreshToken };
  }
}
