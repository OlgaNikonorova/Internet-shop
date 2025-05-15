import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { UserStatus } from 'src/domain/enums/user-status.enum';

export class UserDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User UUID',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
    required: false,
  })
  @IsEmail()
  @Optional()
  email?: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'User address',
    required: false,
  })
  @IsString()
  @MinLength(10)
  address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  @IsString()
  @MinLength(10)
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: UserRole.Admin,
    description: 'User Role',
    required: true,
    enum: UserRole,
    examples: Object.values(UserRole),
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: UserStatus.Active,
    description: 'Status of the user',
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    example: '2025-04-28T12:00:00.000Z',
    description: 'user creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-28T12:00:00.000Z',
    description: 'user update date',
  })
  updatedAt: Date;
}
