import { UserDto } from '@dto/users/user.dto';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(UserDto, [
  'username',
  'password',
] as const) {}
