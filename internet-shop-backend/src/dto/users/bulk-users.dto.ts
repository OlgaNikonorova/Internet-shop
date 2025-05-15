import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { UserStatus } from 'src/domain/enums/user-status.enum';

export class BulkUsersDto {
  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'Array of user IDs to perform bulk operation on',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  userIds: string[];

  @ApiProperty({
    example: UserRole.Admin,
    description: 'New role to assign to users (optional)',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    example: UserStatus.Banned,
    description: 'New status to assign to users (optional)',
    enum: UserStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
