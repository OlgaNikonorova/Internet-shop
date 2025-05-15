import { User } from '@entities/user.entity';
import { IAuthService } from '@interfaces/auth.service.interface';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@dto/auth/login.dto';
import { RegisterDto } from '@dto/auth/register.dto';
import { AuthResponseDto } from '@dto/auth/auth-response.dto';
import { UserResponseDto } from '@dto/users/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { Cart } from '@entities/cart.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { RequestPasswordResetDto } from '@dto/auth/request-password-reset.dto';
import { ResetPasswordResponseDto } from '@dto/auth/reset-password-response.dto';
import * as crypto from 'crypto';
import { ResetPasswordDto } from '@dto/auth/reset-password-dto';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly _cartRepository: Repository<Cart>,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  public async login(userData: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(userData);
    const payload = this.createJwtPayload(user);

    let refreshToken: string | undefined = undefined;

    if (user.refreshToken) {
      try {
        await this._jwtService.verifyAsync(user.refreshToken, {
          secret: this._configService.get<string>('REFRESH_TOKEN_SECRET'),
        });
        refreshToken = user.refreshToken;
      } catch (error) {
        this.logger.debug(`Existing refresh token invalid for user ${user.id}`);
      }
    }

    if (!refreshToken) {
      refreshToken = await this.generateRefreshToken(payload);
      user.refreshToken = refreshToken;
      await this._usersRepository.update(user.id, { refreshToken });
    }

    const accessToken = await this.generateAccessToken(payload);

    return { user: this.createUserResponse(user), accessToken, refreshToken };
  }

  public async register(userData: RegisterDto): Promise<AuthResponseDto> {
    await this.validateUniqueUser(userData);

    const user = this.createUser(userData);
    this.logger.debug(`Saving user: ${JSON.stringify(user)}`);
    const savedUser = await this._usersRepository.save(user);

    const cart = this._cartRepository.create({
      user: savedUser,
      items: [],
      totalPrice: 0,
    });
    await this._cartRepository.save(cart);

    const payload = this.createJwtPayload(savedUser);
    const [accessToken, refreshToken] = await this.generateTokens(payload);

    await this._usersRepository.update(savedUser.id, { refreshToken });
    return {
      user: this.createUserResponse(savedUser),
      accessToken,
      refreshToken,
    };
  }

  public async validateUser(userData: LoginDto): Promise<User> {
    const user = await this._usersRepository.findOneBy({
      username: userData.username,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password or login');
    }

    return user;
  }

  public async refresh(payload: JwtPayload): Promise<AuthResponseDto> {
    const user = await this._usersRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newPayload = this.createJwtPayload(user);
    const [accessToken, refreshToken] = await this.generateTokens(newPayload);

    user.refreshToken = refreshToken;
    await this._usersRepository.save(user);

    return {
      user: this.createUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  public async requestPasswordReset(
    resetDto: RequestPasswordResetDto,
  ): Promise<ResetPasswordResponseDto> {
    if (!resetDto.email && !resetDto.username) {
      throw new BadRequestException(
        'Either email or username must be provided',
      );
    }

    const user = await this._usersRepository.findOne({
      where: [{ email: resetDto.email }, { username: resetDto.username }],
    });

    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent user: email=${resetDto.email}, username=${resetDto.username}`,
      );
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await this._usersRepository.save(user);

    this.logger.log(`Password reset token generated for user ${user.id}`);

    return { resetToken };
  }

  public async resetPassword(resetDto: ResetPasswordDto): Promise<void> {
    const user = await this._usersRepository.findOne({
      where: {
        resetPasswordToken: resetDto.token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      this.logger.warn(`Invalid or expired reset token: ${resetDto.token}`);
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = resetDto.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this._usersRepository.save(user);

    this.logger.log(`Password reset successfully for user ${user.id}`);
  }

  public async logout(userId: string): Promise<void> {
    await this._usersRepository.update(userId, { refreshToken: null });
  }

  private async generateTokens(payload: JwtPayload): Promise<[string, string]> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return Promise.all([accessToken, refreshToken]);
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this._jwtService.signAsync(payload, {
      secret: this._configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this._jwtService.signAsync(payload, {
      secret: this._configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '3d',
    });
  }

  private async validateUniqueUser(userData: RegisterDto): Promise<void> {
    const existingUserByUsername = await this._usersRepository.findOneBy({
      username: userData.username,
    });

    if (existingUserByUsername) {
      throw new BadRequestException('User with such username already exists');
    }

    if (userData.email) {
      const existingUserByEmail = await this._usersRepository.findOneBy({
        email: userData.email,
      });

      if (existingUserByEmail) {
        throw new BadRequestException('User with such email already exists');
      }
    }

    if (userData.phone) {
      const existingUserByPhone = await this._usersRepository.findOneBy({
        phone: userData.phone,
      });

      if (existingUserByPhone) {
        throw new BadRequestException(
          'User with such phone number already exists',
        );
      }
    }
  }

  private createUser(userData: RegisterDto): User {
    const user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.name = userData.name;
    user.address = userData.address;
    user.password = userData.password;
    user.role = userData.role ?? UserRole.User;
    user.avatar = userData.avatar;
    user.phone = userData.phone;
    return user;
  }

  private createUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private createJwtPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      username: user.username,
      role: user.role,
      jti: crypto.randomUUID(),
    };
  }
}
