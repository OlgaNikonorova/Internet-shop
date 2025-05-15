import { PageDto } from '@dto/common/page.dto';
import { ProductDto } from '@dto/product/product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class FavoritesPageDto {
  @ApiProperty({
    type: ProductDto,
    description: 'List of products',
    isArray: true,
  })
  @IsArray()
  products: ProductDto[];

  @ApiProperty({
    type: PageDto,
    description: 'Favorites products page dto params',
  })
  pageDto: PageDto;
}
