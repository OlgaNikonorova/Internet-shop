import { PickType } from '@nestjs/swagger';
import { CartItemDto } from './cart-item.dto';

export class CartItemRemoveDto extends PickType(CartItemDto, ['id'] as const) {}
