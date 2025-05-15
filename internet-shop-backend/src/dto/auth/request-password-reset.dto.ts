import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'user unique email',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'unique username',
  })
  @IsString()
  @IsOptional()
  username?: string;
}
