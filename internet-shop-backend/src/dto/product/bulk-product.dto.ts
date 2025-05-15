// bulk-products.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ProductCategory } from 'src/domain/enums/product-category.enum';
import { ProductStatus } from 'src/domain/enums/product-status.enum';

export class BulkProductsDto {
  @ApiProperty({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'Array of product IDs to perform bulk operation on',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  productIds: string[];

  @ApiProperty({
    example: ProductStatus.Inactive,
    description: 'New status to assign to products (optional)',
    enum: ProductStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiProperty({
    example: ProductCategory.Electronics,
    description: 'New category to assign to products (optional)',
    enum: ProductCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;
}
