import { AddToFavoritesDto } from '@dto/favorites/add-to-favorites.dto';
import { Product } from '@entities/product.entity';
import { FavoriesPage } from '../models/favorites-page';
import { FavoritesFiltersDto } from '@dto/favorites/favorites-filters.dto';

export interface IFavoritesService {
  addFavorites(addDto: AddToFavoritesDto, userId: string): Promise<Product>;
  removeFavorites(productId: string, userId: string): Promise<void>;
  getFavorites(userId: string): Promise<Product[]>;
  clear(userId: string): Promise<void>;

  /**
   * Retrieves all favorite products.
   *
   * @returns A promise that resolves to a favorites page with page params and an array of all favorite products.
   */
  getAllPage(
    userId: string,
    filters: FavoritesFiltersDto,
  ): Promise<FavoriesPage>;
}
