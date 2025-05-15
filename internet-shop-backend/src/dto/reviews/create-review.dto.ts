import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Max, MaxLength, Min } from 'class-validator';
import { ProductRating } from 'src/domain/enums/product-rating.enum';

export class CreateReviewDto {
  @ApiProperty({
    example: ProductRating.FIVE_STARS,
    description: 'Rating for the product',
    enum: ProductRating,
  })
  @IsEnum(ProductRating)
  @Min(ProductRating.ONE_STAR)
  @Max(ProductRating.FIVE_STARS)
  rating: ProductRating;

  @ApiProperty({
    example: 'Great product, highly recommend!',
    description: 'Review comment',
  })
  @IsString()
  @MaxLength(1000)
  comment: string;
}
