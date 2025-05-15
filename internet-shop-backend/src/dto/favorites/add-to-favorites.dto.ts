import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddToFavoritesDto {
  @ApiProperty({
    description:
      'The unique identifier of the product to be added to favorites',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;
}
