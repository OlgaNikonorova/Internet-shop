import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Inject,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDto } from '@dto/product/product.dto';
import { IFavoritesService } from '@interfaces/favorites.service.interface';
import { FavoritesService } from '@app/favorites/favorites.service';
import { AddToFavoritesDto } from '@dto/favorites/add-to-favorites.dto';
import { GetUserId } from '@common/decorators/get-user-id.decorator';
import { FavoritesPageDto } from '@dto/favorites/favorites-page.dto';
import { FavoritesFiltersDto } from '@dto/favorites/favorites-filters.dto';

@ApiTags('Favorites')
@Controller('favorites')
@ApiBearerAuth()
export class FavoritesController {
  constructor(
    @Inject(FavoritesService)
    private readonly _favoritesService: IFavoritesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add product to favorites',
    operationId: 'addToFavorites',
  })
  @ApiBody({
    type: AddToFavoritesDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Product added to favorites',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Product already in favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  async addToFavorites(
    @GetUserId() userId: string,
    @Body() dto: AddToFavoritesDto,
  ): Promise<ProductDto> {
    const favorite = await this._favoritesService.addFavorites(dto, userId);

    return {
      id: favorite.id,
      name: favorite.name,
      description: favorite.description,
      price: favorite.price,
      stock: favorite.stock,
      category: favorite.category,
      images: favorite.images,
      rating: favorite.rating,
      reviewsCount: favorite.reviewsCount,
      createdAt: favorite.createdAt,
      updatedAt: favorite.updatedAt,
      status: favorite.status,
    };
  }

  @Delete(':productId')
  @ApiOperation({
    summary: 'Remove product from favorites',
    operationId: 'removeFromFavorites',
  })
  @ApiParam({
    name: 'productId',
    required: true,
    description: 'ID of the product to remove',
  })
  @ApiResponse({ status: 200, description: 'Product removed from favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found in favorites' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  async removeFromFavorites(
    @GetUserId() userId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this._favoritesService.removeFavorites(productId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorites', operationId: 'getFavorites' })
  @ApiResponse({
    status: 200,
    description: 'List of favorite products',
    type: ProductDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  async getFavorites(@GetUserId() userId: string): Promise<ProductDto[]> {
    const products = await this._favoritesService.getFavorites(userId);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: product.images,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      status: product.status,
      reviews: product.reviews,
    }));
  }

  @Get('page')
  @ApiOperation({
    summary: 'Get paginated favorite products',
    operationId: 'getPaginatedFavorites',
  })
  @ApiResponse({
    status: 200,
    description: 'List of favorite products with pagination params',
    type: FavoritesPageDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getAllPage(
    @GetUserId() userId: string,
    @Query() filtersDto: FavoritesFiltersDto,
  ): Promise<FavoritesPageDto> {
    const page = await this._favoritesService.getAllPage(userId, filtersDto);

    return {
      pageDto: page.page,
      products: page.favorites.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        reviewsCount: p.reviewsCount,
        rating: p.rating,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        price: p.price,
        category: p.category,
        stock: p.stock,
        images: p.images,
        status: p.status,
        reviews: p.reviews,
      })),
    };
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear favorites', operationId: 'clearFavorites' })
  @ApiResponse({
    status: 200,
    description: 'Favorites cleared successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async clear(@GetUserId() userId: string): Promise<void> {
    await this._favoritesService.clear(userId);
  }
}
