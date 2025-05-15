import { UserDto } from '@dto/users/user.dto';
import { PickType } from '@nestjs/swagger';

export class RegisterDto extends PickType(UserDto, [
  'username',
  'email',
  'name',
  'address',
  'phone',
  'password',
  'avatar',
  'role',
] as const) {}
