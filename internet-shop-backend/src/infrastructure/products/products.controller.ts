import { GetUserId } from '@common/decorators/get-user-id.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { BulkProductsDto } from '@dto/product/bulk-product.dto';
import { CreateProductDto } from '@dto/product/create-product.dto';
import { ProductFiltersDto } from '@dto/product/product-filters.dto';
import { ProductPageDto } from '@dto/product/product-page.dto';
import { ProductDto } from '@dto/product/product.dto';
import { UpdateProductDto } from '@dto/product/update-product.dto';
import { Product } from '@entities/product.entity';
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
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from 'src/application/products/products.service';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IProductService } from 'src/domain/interfaces/product.service.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ProductsService)
    private readonly _productsService: IProductService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products', operationId: 'getAllProducts' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: ProductDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getAll(): Promise<ProductDto[]> {
    const products = await this._productsService.findAllAsync();
    return products.map((p) => this.mapToDto(p));
  }

  @Get('page')
  @ApiOperation({
    summary: 'Get paginated products',
    operationId: 'getPaginatedProducts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products with pagination params',
    type: ProductPageDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getAllPage(
    @Query() filtersDto: ProductFiltersDto,
  ): Promise<ProductPageDto> {
    const page = await this._productsService.getAllPage(filtersDto);
    return {
      page: page.page,
      products: page.products.map((p) => this.mapToDto(p)),
    };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.Seller)
  @ApiOperation({
    summary: 'Create a new product',
    operationId: 'createProduct',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data and images',
  })
  @ApiResponse({
    status: 200,
    description: 'Product created successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ProductDto> {
    const newProduct = await this._productsService.createAsync(
      createProductDto,
      files,
    );
    return this.mapToDto(newProduct);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID', operationId: 'getProductById' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: ProductDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getById(
    @GetUserId('userId') userId: string,
    @Param('id') id: string,
  ): Promise<ProductDto> {
    const foundProduct =
      await this._productsService.findByIdOrThrowNotFoundAsync(userId, id);
    return this.mapToDto(foundProduct);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.Seller)
  @ApiOperation({ summary: 'Update product', operationId: 'updateProductById' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product data and images',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async updateById(
    @Param('id') id: string,
    @GetUserId('userId') userId: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ProductDto> {
    const updatedProduct = await this._productsService.updateAsync(
      userId,
      id,
      updateProductDto,
      files,
    );
    return this.mapToDto(updatedProduct);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.Seller)
  @ApiOperation({ summary: 'Delete product', operationId: 'deleteProductById' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Admin or Seller access required',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async remove(@Param('id') id: string): Promise<void> {
    return await this._productsService.deleteAsync(id);
  }

  @Post('bulk')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.Seller)
  @ApiOperation({
    summary: 'Bulk update products',
    operationId: 'bulkUpdateProducts',
  })
  @ApiBody({ type: BulkProductsDto })
  @ApiResponse({
    status: 200,
    description: 'Products updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Admin of Seller access required',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async bulkUpdate(@Body() bulkDto: BulkProductsDto): Promise<void> {
    await this._productsService.bulkUpdate(bulkDto);
  }

  private mapToDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      reviewsCount: product.reviewsCount,
      rating: product.rating,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
      status: product.status,
    };
  }
}
