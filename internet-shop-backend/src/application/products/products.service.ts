import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductService } from '@interfaces/product.service.interface';
import { Product } from '@entities/product.entity';
import { CreateProductDto } from '@dto/product/create-product.dto';
import { UpdateProductDto } from '@dto/product/update-product.dto';
import { ProductFiltersDto } from '@dto/product/product-filters.dto';
import { ProductPage } from 'src/domain/models/product-page';
import { ProductSortField } from 'src/domain/enums/product-sort-field.enum';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { RecommendationsGateway } from './recommendations.gateway';
import { ProductCategory } from 'src/domain/enums/product-category.enum';
import { BulkProductsDto } from '@dto/product/bulk-product.dto';
import { ProductDto } from '@dto/product/product.dto';

@Injectable()
export class ProductsService implements IProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,

    private readonly _recommendationsGateway: RecommendationsGateway,
  ) {}

  public async createAsync(dto: CreateProductDto): Promise<Product> {
    const product = this._productRepository.create(dto);
    return await this._productRepository.save(product);
  }

  public async findAllAsync(): Promise<Product[]> {
    return await this._productRepository.find();
  }

  public async getAllPage(filtersDto: ProductFiltersDto): Promise<ProductPage> {
    const queryBuilder = this._productRepository.createQueryBuilder('product');

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

    if (filtersDto.status) {
      queryBuilder.andWhere('product.status = :status', {
        status: filtersDto.status,
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
      queryBuilder.andWhere('product.createdAt >= :createdDateFrom', {
        createdDateFrom: filtersDto.createdDateFrom,
      });
    }

    if (filtersDto.createdDateTo) {
      queryBuilder.andWhere('product.createdAt <= :createdDateTo', {
        createdDateTo: filtersDto.createdDateTo,
      });
    }

    if (filtersDto.updatedDateFrom) {
      queryBuilder.andWhere('product.updatedAt >= :updatedDateFrom', {
        updatedDateFrom: filtersDto.updatedDateFrom,
      });
    }

    if (filtersDto.updatedDateTo) {
      queryBuilder.andWhere('product.updatedAt <= :updatedDateTo', {
        updatedDateTo: filtersDto.updatedDateTo,
      });
    }

    const sortFieldMap: { [key in ProductSortField]: string } = {
      [ProductSortField.Name]: 'product.name',
      [ProductSortField.Description]: 'product.description',
      [ProductSortField.Price]: 'product.price',
      [ProductSortField.ReviewsCount]: 'product.reviewsCount',
      [ProductSortField.Rating]: 'product.rating',
      [ProductSortField.Category]: 'product.category',
      [ProductSortField.Stock]: 'product.stock',
      [ProductSortField.UpdatedAt]: 'product.updatedAt',
      [ProductSortField.CreatedAt]: 'product.createdAt',
    };

    if (filtersDto.sort && filtersDto.sort.length > 0) {
      filtersDto.sort.forEach((criteria) => {
        const field = sortFieldMap[criteria.field];
        if (field) {
          queryBuilder.addOrderBy(
            field,
            criteria.order === OrderBy.Ascending ? 'ASC' : 'DESC',
          );
        }
      });
    } else {
      queryBuilder.orderBy('product.updatedAt', 'DESC');
    }

    queryBuilder.skip(filtersDto.skip).take(filtersDto.pageSize);

    const pageSize = filtersDto.pageSize ?? 10;
    const pageIndex = filtersDto.pageIndex ?? 1;

    const [products, totalCount] = await queryBuilder.getManyAndCount();

    return {
      page: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageIndex: pageIndex,
        hasNextPage: pageIndex < Math.ceil(totalCount / pageSize),
        hasPreviousPage: pageIndex > 1,
      },
      products,
    };
  }

  public async findByIdOrThrowNotFoundAsync(
    userId: string,
    productId: string,
  ): Promise<Product> {
    const product = await this._productRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (userId) {
      const recommendations = await this.getRecommendations(
        product.category,
        productId,
      );

      this._recommendationsGateway.notifyRecommendations(userId, {
        recommendations,
      });
    }

    return product;
  }

  public async updateAsync(
    userId: string,
    productId: string,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findByIdOrThrowNotFoundAsync(userId, productId);
    return await this._productRepository.save({
      ...product,
      ...productDto,
    });
  }

  public async deleteAsync(id: string): Promise<void> {
    await this._productRepository.delete(id);
  }

  public async bulkUpdate(bulkDto: BulkProductsDto): Promise<void> {
    if (!bulkDto.status && !bulkDto.category) {
      throw new BadRequestException(
        'At least one of status or category must be provided',
      );
    }

    const updateData: Partial<Product> = {};

    if (bulkDto.status) {
      updateData.status = bulkDto.status;
    }
    if (bulkDto.category) {
      updateData.category = bulkDto.category;
    }

    await this._productRepository
      .createQueryBuilder()
      .update(Product)
      .set(updateData)
      .where('id IN (:...productIds)', { productIds: bulkDto.productIds })
      .execute();
  }

  private async getRecommendations(
    category: ProductCategory,
    excludeProductId: string,
  ): Promise<ProductDto[]> {
    const products = await this._productRepository
      .createQueryBuilder('product')
      .where('product.category = :category', { category })
      .andWhere('product.id != :excludeProductId', { excludeProductId })
      .orderBy('product.rating', 'DESC')
      .take(3)
      .getMany();

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      images: p.images ?? [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      description: p.description,
      status: p.status,
      stock: p.stock,
      reviewsCount: p.reviewsCount,
      rating: p.rating,
    }));
  }
}
