import { LoginDto } from '@dto/auth/login.dto';
import { RegisterDto } from '@dto/auth/register.dto';
import { AuthResponseDto } from '@dto/auth/auth-response.dto';
import { User } from '@entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { RequestPasswordResetDto } from '@dto/auth/request-password-reset.dto';
import { ResetPasswordResponseDto } from '@dto/auth/reset-password-response.dto';
import { ResetPasswordDto } from '@dto/auth/reset-password-dto';

/**
 * Interface representing the authentication service.
 * Provides methods for user login, registration, and validation.
 */
export interface IAuthService {
  login(userData: LoginDto): Promise<AuthResponseDto>;
  register(userData: RegisterDto): Promise<AuthResponseDto>;
  refresh(rpayload: JwtPayload): Promise<AuthResponseDto>;
  validateUser(userData: LoginDto): Promise<User>;
  logout(userId: string): Promise<void>;
  requestPasswordReset(
    resetDto: RequestPasswordResetDto,
  ): Promise<ResetPasswordResponseDto>;
  resetPassword(resetDto: ResetPasswordDto): Promise<void>;
}
