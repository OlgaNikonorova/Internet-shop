import { UserDto } from '@dto/users/user.dto';
import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RegisterDto extends PickType(UserDto, [
  'username',
  'email',
  'name',
  'address',
  'phone',
  'password',
  'avatar',
  'role',
] as const) {
  @IsOptional()
  avatar?: string;
}
