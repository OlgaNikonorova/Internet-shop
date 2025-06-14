import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { IsOptional } from 'class-validator';

export class CreateProductDto extends OmitType(ProductDto, [
  'id',
  'createdAt',
  'updatedAt',
  'rating',
  'reviewsCount',
] as const) {
  @ApiProperty({
    type: 'array',
    items: { type: 'string'},
    description: 'Product images',
    required: false,
  })
  @IsOptional()
  images?: any;
}
