import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ProductCategory } from 'src/domain/enums/product-category.enum';

export class CartItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Cart item UUID',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Product UUID',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 'Laptop', description: 'Product name' })
  productName: string;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  productPrice: number;

  @ApiProperty({
    example: 'DecorativeCosmetics',
    description: 'Product category',
    enum: ProductCategory,
    examples: Object.values(ProductCategory),
  })
  @IsEnum(ProductCategory)
  productCategory: ProductCategory;

  @ApiProperty({
    example: ['http://localhost:3000/uploads/image1.jpg'],
    description: 'Product images',
    required: false,
  })
  @IsArray()
  @IsOptional()
  productImages?: string[];

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product in the cart',
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: '2025-04-28T12:00:00.000Z',
    description: 'Cart item update date',
  })
  updatedAt: Date;
}
