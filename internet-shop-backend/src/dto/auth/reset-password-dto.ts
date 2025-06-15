import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'reset password token',
  })
  token: string;

  @ApiProperty({
    example: 'adfgngdahh',
    description: 'password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
