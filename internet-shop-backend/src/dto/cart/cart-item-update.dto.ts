import { PickType } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';

export class CartItemUpdateDto extends PickType(CartItemDto, [
  'quantity',
] as const) {}
