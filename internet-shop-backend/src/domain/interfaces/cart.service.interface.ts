import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CartItemRemoveDto } from '@dto/cart/cart-item-remove.dto';
import { AddToCartDto } from '@dto/cart/add-to-card-dto';
import { CartPage } from '../models/cart-page';
import { CartItemsFiltersDto } from '@dto/cart/cart-item-filters.dto';

/**
 * Interface representing the cart service.
 * Provides methods to manage a user's shopping cart, including retrieving the cart,
 * adding, updating, and removing items, as well as clearing the cart.
 */
export interface ICartService {
  /**
   * Retrieves the cart for a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to the user's cart.
   */
  get(userId: string): Promise<Cart>;

  /**
   * Retrieves the cart items page for a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @param filters - The filters to apply when retrieving the cart items.
   * @returns A promise that resolves to the user's cart items page.
   */
  getItemsPage(userId: string, filters: CartItemsFiltersDto): Promise<CartPage>;

  /**
   * Adds an item to the user's cart.
   *
   * @param userId - The unique identifier of the user.
   * @param addItemDto - The data transfer object containing details of the item to add.
   * @returns A promise that resolves to the added cart item.
   */
  addItem(userId: string, addItemDto: AddToCartDto): Promise<CartItem>;

  /**
   * Updates an existing item in the user's cart.
   *
   * @param userId - The unique identifier of the user.
   * @param cartItemId - The unique identifier of the cart item.
   * @param quantity - The new quantity for the cart item.
   * @returns A promise that resolves to the updated cart item.
   */
  updateItem(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem>;

  /**
   * Removes an item from the user's cart.
   *
   * @param userId - The unique identifier of the user.
   * @param removeItemDto - The data transfer object containing details of the item to remove.
   * @returns A promise that resolves when the item is removed.
   */
  removeItem(userId: string, removeItemDto: CartItemRemoveDto): Promise<void>;

  /**
   * Clears all items from the user's cart.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves when the cart is cleared.
   */
  clear(userId: string): Promise<void>;
}
