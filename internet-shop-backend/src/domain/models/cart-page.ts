import { CartItem } from '@entities/cart-item.entity';
import { Page } from './page';

export class CartPage {
  page: Page;
  items: CartItem[];

  constructor(page: Page, items: CartItem[]) {
    this.page = page;
    this.items = items;
  }
}
