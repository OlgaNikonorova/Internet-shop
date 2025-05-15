import { AuthService } from '@app/auth/auth.service';
import { GetUserId } from '@common/decorators/get-user-id.decorator';
import { Public } from '@common/decorators/public.decorator';
import { RefreshJwtGuard } from '@common/guards/refresh-jwt.guard';
import { AuthResponseDto } from '@dto/auth/auth-response.dto';
import { LoginDto } from '@dto/auth/login.dto';
import { RefreshTokenDto } from '@dto/auth/refresh-token.dto';
import { RegisterDto } from '@dto/auth/register.dto';
import { RequestPasswordResetDto } from '@dto/auth/request-password-reset.dto';
import { ResetPasswordDto } from '@dto/auth/reset-password-dto';
import { ResetPasswordResponseDto } from '@dto/auth/reset-password-response.dto';
import { IAuthService } from '@interfaces/auth.service.interface';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly _authService: IAuthService,
  ) {}

  @Public()
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Login user and return JWT token',
    operationId: 'login',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  public async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this._authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user', operationId: 'register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() registerBody: RegisterDto): Promise<AuthResponseDto> {
    return await this._authService.register(registerBody);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user and invalidate refresh token',
    operationId: 'logout',
  })
  @ApiResponse({
    status: 201,
    description: 'Logout successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @ApiResponse({ status: 500, description: 'Internal server error' })
  public async logout(@GetUserId('userId') userId: string): Promise<void> {
    await this._authService.logout(userId);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password method for getting reset token',
    operationId: 'forgotPasswordRequest',
  })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiResponse({
    status: 200,
    description: 'reset token has been generated successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request password data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<ResetPasswordResponseDto> {
    return await this._authService.requestPasswordReset({
      email: dto.email,
      username: dto.username,
    });
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Change password with new one',
    operationId: 'resetPassword',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 201,
    description: 'password has been updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this._authService.resetPassword({
      token: dto.token,
      password: dto.password,
    });
  }

  @Public()
  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  @ApiOperation({
    summary: 'Refresh access token using refresh token',
    operationId: 'refresh',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async refresh(@Req() req: Request): Promise<AuthResponseDto> {
    const payload = req.user as JwtPayload;
    return await this._authService.refresh(payload);
  }
}
