import { AddToFavoritesDto } from '@dto/favorites/add-to-favorites.dto';
import { FavoritesFiltersDto } from '@dto/favorites/favorites-filters.dto';
import { Favorite } from '@entities/favorite.entity';
import { Product } from '@entities/product.entity';
import { IFavoritesService } from '@interfaces/favorites.service.interface';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoritesSortField } from 'src/domain/enums/favorites-sort-field.enum';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { FavoriesPage } from 'src/domain/models/favorites-page';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService implements IFavoritesService {
  private readonly _logger = new Logger(FavoritesService.name);

  constructor(
    @InjectRepository(Favorite)
    private readonly _favoriteRepository: Repository<Favorite>,
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,
  ) {}

  public async getAllPage(
    userId: string,
    filtersDto: FavoritesFiltersDto,
  ): Promise<FavoriesPage> {
    const queryBuilder = this._favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.product', 'product')
      .where('favorite.userId = :userId', { userId });

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

    if (filtersDto.createdDateFrom) {
      queryBuilder.andWhere('favorite.createdAt >= :favoriteCreatedDateFrom', {
        favoriteCreatedDateFrom: filtersDto.createdDateFrom,
      });
    }

    if (filtersDto.createdDateTo) {
      queryBuilder.andWhere('favorite.createdAt <= :favoriteCreatedDateTo', {
        favoriteCreatedDateTo: filtersDto.createdDateTo,
      });
    }

    queryBuilder
      .orderBy(
        `product.${filtersDto.sortField ?? FavoritesSortField.CreatedAt}`,
        filtersDto.orderBy === OrderBy.Ascending ? 'ASC' : 'DESC',
      )
      .skip(filtersDto.skip)
      .take(filtersDto.pageSize);

    const pageSize = filtersDto.pageSize ?? 10;
    const pageIndex = filtersDto.pageIndex ?? 1;

    const [favorites, totalCount] = await queryBuilder.getManyAndCount();

    return {
      page: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageIndex: pageIndex,
        hasNextPage: pageIndex < Math.ceil(totalCount / pageSize),
        hasPreviousPage: pageIndex > 1,
      },
      favorites: favorites.map((f) => ({
        id: f.product.id,
        name: f.product.name,
        description: f.product.description,
        reviewsCount: f.product.reviewsCount,
        rating: f.product.rating,
        createdAt: f.product.createdAt,
        updatedAt: f.product.updatedAt,
        price: f.product.price,
        category: f.product.category,
        stock: f.product.stock,
        images: f.product.images,
        favorites: favorites,
        status: f.product.status,
        reviews: f.product.reviews,
      })),
    };
  }

  public async addFavorites(
    addDto: AddToFavoritesDto,
    userId: string,
  ): Promise<Product> {
    this._logger.log(
      `Adding product ${addDto.productId} to favorites for user ${userId}`,
    );

    const product = await this._productRepository.findOneBy({
      id: addDto.productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingFavorite = await this._favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: addDto.productId } },
    });

    if (existingFavorite) {
      this._logger.warn(
        `Product ${addDto.productId} already in favorites for user ${userId}`,
      );
      throw new ConflictException('Product already in favorites');
    }

    const favorite = this._favoriteRepository.create({
      user: { id: userId },
      product,
    });

    await this._favoriteRepository.save(favorite);

    this._logger.log(
      `Added product ${addDto.productId} to favorites for user ${userId}`,
    );

    return product;
  }

  public async removeFavorites(
    productId: string,
    userId: string,
  ): Promise<void> {
    this._logger.log(
      `Removing product ${productId} from favorites for user ${userId}`,
    );

    const deleteResult = await this._favoriteRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });

    if (deleteResult.affected === 0) {
      this._logger.warn(
        `Product ${productId} not found in favorites for user ${userId}`,
      );
      throw new NotFoundException('Product not found in favorites');
    }

    this._logger.log(
      `Removed product ${productId} from favorites for user ${userId}`,
    );
  }

  public async getFavorites(userId: string): Promise<Product[]> {
    this._logger.log(`Fetching favorites for user ${userId}`);

    const favorites = await this._favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    this._logger.log(
      `Found ${favorites.length} favorite products for user ${userId}`,
    );

    return favorites.map((favorite) => favorite.product);
  }

  public async clear(userId: string): Promise<void> {
    this._logger.log(`clearing the favorites for user ${userId}`);
    await this._favoriteRepository.delete({ user: { id: userId } });
    this._logger.log(`Cleared favorites for user ${userId}`);
  }
}
