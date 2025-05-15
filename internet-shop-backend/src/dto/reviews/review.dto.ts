import { ApiProperty } from '@nestjs/swagger';
import { ProductRating } from 'src/domain/enums/product-rating.enum';

export class ReviewDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 4.75 })
  rating: ProductRating;

  @ApiProperty({ example: 'Great product, highly recommend!' })
  comment: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;

  @ApiProperty({ example: '2025-05-06T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-06T10:00:00.000Z' })
  updatedAt: Date;
}
