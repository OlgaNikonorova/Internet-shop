import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserUpdateDto extends OmitType(PartialType(UserDto), [
  'createdAt',
  'updatedAt',
  'id',
] as const) {}
