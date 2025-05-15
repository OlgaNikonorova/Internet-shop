import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, IsNumber, Min } from 'class-validator';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cart UUID',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: CartItemDto,
    description: 'Items in the cart',
    isArray: true,
  })
  @IsArray()
  items: CartItemDto[];

  @ApiProperty({
    example: 1999.98,
    description: 'Total price of items in the cart',
  })
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiProperty({
    example: '2025-04-28T12:00:00.000Z',
    description: 'Cart update date',
  })
  updatedAt: Date;
}
