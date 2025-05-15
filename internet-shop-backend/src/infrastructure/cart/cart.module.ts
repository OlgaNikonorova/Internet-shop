import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/domain/entities/cart.entity';
import { CartService } from 'src/application/cart/cart.service';
import { CartItem } from 'src/domain/entities/cart-item.entity';
import { Product } from '@entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
