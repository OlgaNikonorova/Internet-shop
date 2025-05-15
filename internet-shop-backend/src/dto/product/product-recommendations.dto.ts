import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class ProductRecommendationsDto {
  @ApiProperty({
    type: ProductDto,
    isArray: true,
    description: 'Product Recommendation',
  })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsArray()
  recommendations: ProductDto[];

  constructor(recommendations: ProductDto[]) {
    this.recommendations = recommendations;
  }
}
