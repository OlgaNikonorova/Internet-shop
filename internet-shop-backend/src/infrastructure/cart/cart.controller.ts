import { GetUserId } from '@common/decorators/get-user-id.decorator';
import { AddToCartDto } from '@dto/cart/add-to-card-dto';
import { CartDto } from '@dto/cart/cart-dto';
import { CartItemsFiltersDto } from '@dto/cart/cart-item-filters.dto';
import { CartItemUpdateDto } from '@dto/cart/cart-item-update.dto';
import { CartItemDto } from '@dto/cart/cart-item.dto';
import { CartPageDto } from '@dto/cart/cart-page.dto';
import { JwtPayload } from '@interfaces/jwt-payload.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CartService } from 'src/application/cart/cart.service';
import { ICartService } from 'src/domain/interfaces/cart.service.interface';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    @Inject(CartService)
    private readonly _cartService: ICartService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart', operationId: 'getCart' })
  @ApiResponse({ status: 200, description: 'User cart details', type: CartDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getCart(@GetUserId('userId') userId: string): Promise<CartDto> {
    const cart = await this._cartService.get(userId);
    return {
      id: cart.id,
      items: cart.items.map((c) => ({
        id: c.id,
        quantity: c.quantity,
        productId: c.product.id,
        productName: c.product.name,
        productPrice: c.product.price,
        productCategory: c.product.category,
        productImages: c.product.images,
        updatedAt: c.updatedAt,
      })),
      totalPrice: cart.totalPrice,
      updatedAt: cart.updatedAt,
    };
  }

  @Get('page')
  @ApiOperation({
    summary: 'Get paginated cart items products',
    operationId: 'getPaginatedCartItems',
  })
  @ApiResponse({
    status: 200,
    description: 'List of the cart items with pagination params',
    type: CartPageDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getAllPage(
    @GetUserId() userId: string,
    @Query() filtersDto: CartItemsFiltersDto,
  ): Promise<CartPageDto> {
    const page = await this._cartService.getItemsPage(userId, filtersDto);

    return {
      pageDto: page.page,
      products: page.items.map((p) => ({
        id: p.id,
        quantity: p.quantity,
        productId: p.product.id,
        productName: p.product.name,
        productPrice: p.product.price,
        productCategory: p.product.category,
        productImages: p.product.images,
        updatedAt: p.updatedAt,
      })),
    };
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart', operationId: 'addItem' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 200,
    description: 'Item added to cart',
    type: CartItemDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async addItem(
    @Req() req: Request,
    @Body() body: AddToCartDto,
  ): Promise<CartItemDto> {
    const user = req.user as JwtPayload;
    console.log(user);

    const cartItem = await this._cartService.addItem(user.sub, {
      productId: body.productId,
      quantity: body.quantity,
    });

    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      productId: cartItem.product.id,
      productName: cartItem.product.name,
      productPrice: cartItem.product.price,
      productCategory: cartItem.product.category,
      productImages: cartItem.product.images,
      updatedAt: cartItem.updatedAt,
    };
  }

  @Patch('item/:id')
  @ApiOperation({
    summary: 'Update cart item quantity',
    operationId: 'updateCartItemById',
  })
  @ApiParam({
    name: 'id',
    description: 'Cart item ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CartItemUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated',
    type: CartItemDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async updateItem(
    @GetUserId('userId') userId: string,
    @Param('id') itemId: string,
    @Body() body: CartItemUpdateDto,
  ): Promise<CartItemDto> {
    const cartItem = await this._cartService.updateItem(
      userId,
      itemId,
      body.quantity,
    );

    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      productId: cartItem.product.id,
      productName: cartItem.product.name,
      productPrice: cartItem.product.price,
      productCategory: cartItem.product.category,
      productImages: cartItem.product.images,
      updatedAt: cartItem.updatedAt,
    };
  }

  @Delete('item/:id')
  @ApiOperation({
    summary: 'Remove item from cart',
    operationId: 'removeItemById',
  })
  @ApiParam({
    name: 'id',
    description: 'Cart item ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async removeItem(
    @GetUserId('userId') userId: string,
    @Param('id') itemId: string,
  ) {
    await this._cartService.removeItem(userId, { id: itemId });
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear user cart', operationId: 'clearCart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async clearCart(@GetUserId('userId') userId: string) {
    return await this._cartService.clear(userId);
  }
}
