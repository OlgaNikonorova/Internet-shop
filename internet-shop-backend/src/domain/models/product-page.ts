import { Product } from '@entities/product.entity';
import { Page } from './page';

export class ProductPage {
  products: Product[];
  page: Page;

  constructor(products: Product[], page: Page) {
    this.products = products;
    this.page = page;
  }
}
