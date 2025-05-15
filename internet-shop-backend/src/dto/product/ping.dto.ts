import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PingDataDto } from './ping-data.dto';
import { Type } from 'class-transformer';

export class PingDto {
  @ApiProperty({
    description: 'The event name for the ping message',
  })
  @IsString()
  event: string;

  @ApiProperty({
    description: 'Data associated with the ping message',
  })
  @Type(() => PingDataDto)
  data: PingDataDto;
}
