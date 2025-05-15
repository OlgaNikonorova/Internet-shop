import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { User } from '@entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshJwtGuard } from '@common/guards/refresh-jwt.guard';
import { Cart } from '@entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in .env');
        }

        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshJwtStrategy,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtGuard,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    LocalStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
