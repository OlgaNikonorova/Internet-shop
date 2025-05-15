import { Page } from './page';
import { Product } from '@entities/product.entity';

export class FavoriesPage {
  page: Page;
  favorites: Product[];

  constructor(page: Page, favorites: Product[]) {
    this.page = page;
    this.favorites = favorites;
  }
}
