import { AddToCartDto } from '@dto/cart/add-to-card-dto';
import { CartItemsFiltersDto } from '@dto/cart/cart-item-filters.dto';
import { CartItemRemoveDto } from '@dto/cart/cart-item-remove.dto';
import { Product } from '@entities/product.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/domain/entities/cart-item.entity';
import { Cart } from 'src/domain/entities/cart.entity';
import { CartItemsSortField } from 'src/domain/enums/cart-items-sort-field.enum';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { ICartService } from 'src/domain/interfaces/cart.service.interface';
import { CartPage } from 'src/domain/models/cart-page';
import { Repository } from 'typeorm';

@Injectable()
export class CartService implements ICartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly _cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly _cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,
  ) {}

  public async get(userId: string): Promise<Cart> {
    const cart = await this._cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }

    return cart;
  }

  public async getItemsPage(
    userId: string,
    filtersDto: CartItemsFiltersDto,
  ): Promise<CartPage> {
    const queryBuilder = this._cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.cart', 'cart')
      .leftJoinAndSelect('cartItem.product', 'product')
      .where('cart.userId = :userId', { userId });

    if (filtersDto.search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${filtersDto.search}%` },
      );
    }

    if (filtersDto.category) {
      queryBuilder.andWhere('product.category = :category', {
        category: filtersDto.category,
      });
    }

    if (filtersDto.priceFrom !== undefined) {
      queryBuilder.andWhere('product.price >= :priceFrom', {
        priceFrom: filtersDto.priceFrom,
      });
    }

    if (filtersDto.priceTo !== undefined) {
      queryBuilder.andWhere('product.price <= :priceTo', {
        priceTo: filtersDto.priceTo,
      });
    }

    if (filtersDto.reviewsCountFrom !== undefined) {
      queryBuilder.andWhere('product.reviewsCount >= :reviewsCountFrom', {
        reviewsCountFrom: filtersDto.reviewsCountFrom,
      });
    }

    if (filtersDto.reviewsCountTo !== undefined) {
      queryBuilder.andWhere('product.reviewsCount <= :reviewsCountTo', {
        reviewsCountTo: filtersDto.reviewsCountTo,
      });
    }

    if (filtersDto.ratingFrom !== undefined) {
      queryBuilder.andWhere('product.rating >= :ratingFrom', {
        ratingFrom: filtersDto.ratingFrom,
      });
    }
    if (filtersDto.ratingTo !== undefined) {
      queryBuilder.andWhere('product.rating <= :ratingTo', {
        ratingTo: filtersDto.ratingTo,
      });
    }

    if (filtersDto.updatedDateFrom) {
      queryBuilder.andWhere('cartItem.updatedAt >= :cartItemUpdatedDateFrom', {
        cartItemUpdatedDateFrom: filtersDto.updatedDateFrom,
      });
    }

    if (filtersDto.updatedDateTo) {
      queryBuilder.andWhere('cartItem.updatedAt <= :cartItemUpdatedDateTo', {
        cartItemUpdatedDateTo: filtersDto.updatedDateTo,
      });
    }

    queryBuilder
      .orderBy(
        `cartItem.${filtersDto.sortField ?? CartItemsSortField.UpdatedAt}`,
        filtersDto.orderBy === OrderBy.Ascending ? 'ASC' : 'DESC',
      )
      .skip(filtersDto.skip)
      .take(filtersDto.pageSize);

    const pageSize = filtersDto.pageSize ?? 10;
    const pageIndex = filtersDto.pageIndex ?? 1;

    const [items, totalCount] = await queryBuilder.getManyAndCount();

    return {
      page: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageIndex: pageIndex,
        hasNextPage: pageIndex < Math.ceil(totalCount / pageSize),
        hasPreviousPage: pageIndex > 1,
      },
      items: items,
    };
  }

  public async addItem(
    userId: string,
    addItemDto: AddToCartDto,
  ): Promise<CartItem> {
    const cart = await this.get(userId);

    const product = await this._productRepository.findOneBy({
      id: addItemDto.productId,
    });

    if (!product) {
      throw new NotFoundException(`Product ${addItemDto.productId} not found`);
    }

    const addItem = await this._cartItemRepository.save({
      ...addItemDto,
      cart,
      product,
    });

    const savedItem = await this._cartItemRepository.save(addItem);

    cart.items = cart.items || [];
    cart.items.push(savedItem);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    );

    await this._cartRepository.save(cart);
    return savedItem;
  }

  public async updateItem(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> {
    const currentItem = await this._cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['product'],
    });

    if (!currentItem) {
      throw new NotFoundException('Cart item not found');
    }

    const updatedItem = await this._cartItemRepository.save({
      ...currentItem,
      quantity,
    });

    const cart = await this.get(userId);
    const itemIndex = cart.items.findIndex((item) => item.id === cartItemId);

    if (itemIndex > -1) {
      cart.items[itemIndex] = updatedItem;
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.product?.price * item.quantity,
      0,
    );

    await this._cartRepository.save(cart);

    return updatedItem;
  }

  public async removeItem(
    userId: string,
    removeItemDto: CartItemRemoveDto,
  ): Promise<void> {
    const cart = await this.get(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.id === removeItemDto.id,
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
    }

    if (itemIndex === -1) {
      throw new NotFoundException(`Cart item ${removeItemDto.id} not found`);
    }

    await this._cartItemRepository.delete({
      id: removeItemDto.id,
      cart: { id: cart.id },
    });

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0,
    );

    await this._cartRepository.save(cart);
  }

  public async clear(userId: string): Promise<void> {
    const cart = await this.get(userId);

    this.logger.log(`Attempting to clear cart ${cart.id} for user ${userId}`);

    const itemCount = await this._cartItemRepository.count({
      where: { cart: { id: cart.id } },
    });
    this.logger.log(`Found ${itemCount} items in cart ${cart.id}`);

    const deleteResult = await this._cartItemRepository.delete({
      cart: { id: cart.id },
    });
    this.logger.log(
      `Deleted ${deleteResult.affected} items from cart ${cart.id}`,
    );

    cart.items = [];
    cart.totalPrice = 0;

    await this._cartRepository.save(cart);

    this.logger.log(`Cart ${cart.id} cleared successfully`);
  }
}
