import { PageDto } from '@dto/common/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';
import { IsArray } from 'class-validator';

export class CartPageDto {
  @ApiProperty({
    type: CartItemDto,
    description: 'List of cart items',
    isArray: true,
  })
  @IsArray()
  products: CartItemDto[];

  @ApiProperty({ type: PageDto, description: 'Cart page dto params' })
  pageDto: PageDto;
}
