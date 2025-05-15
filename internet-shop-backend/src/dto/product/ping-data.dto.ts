import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class PingDataDto {
  @ApiProperty({
    description: 'Timestamp of the ping message',
    example: '2025-05-07T14:23:01.181Z',
  })
  @IsDateString()
  timestamp: string;
}
