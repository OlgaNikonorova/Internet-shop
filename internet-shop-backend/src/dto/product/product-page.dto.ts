import { PageDto } from '@dto/common/page.dto';
import { ProductDto } from './product.dto';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductPageDto {
  @ApiProperty({
    type: () => [ProductDto],
    description: 'List of products',
  })
  @IsArray()
  products: ProductDto[];

  @ApiProperty({ type: PageDto, description: 'Product page dto params' })
  page: PageDto;
}
