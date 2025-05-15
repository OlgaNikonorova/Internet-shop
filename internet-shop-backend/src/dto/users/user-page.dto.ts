import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from '@dto/common/page.dto';
import { UserResponseDto } from './user-response.dto';

export class UserPageDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'List of users',
    isArray: true,
  })
  @IsArray()
  users: UserResponseDto[];

  @ApiProperty({ type: PageDto, description: 'User page dto params' })
  page: PageDto;
}
