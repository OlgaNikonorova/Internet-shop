import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ProductCategory } from 'src/domain/enums/product-category.enum';
import { ProductStatus } from 'src/domain/enums/product-status.enum';

export class ProductDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Product UUID',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Laptop', description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'High-performance laptop',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: ProductCategory.DecorativeCosmetics,
    description: 'Product category',
    enum: ProductCategory,
    examples: Object.values(ProductCategory),
  })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({
    example: ProductStatus.Active,
    description: 'Product status',
    enum: ProductStatus,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({ example: 100, description: 'Product stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 4.5, description: 'Product rating', required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: 500,
    description: 'Product reviewsCount',
    required: true,
  })
  @IsNumber()
  @Min(0)
  reviewsCount: number;

  @ApiProperty({
    example: '2025-04-28T10:00:00.000Z',
    description: 'Product creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-04-28T12:00:00.000Z',
    description: 'Product update date',
  })
  updatedAt: Date;
}
