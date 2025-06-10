import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CartItemsSortField } from 'src/domain/enums/cart-items-sort-field.enum';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { ProductCategory } from 'src/domain/enums/product-category.enum';

export class CartItemsFiltersDto {
  @ApiProperty({
    example: 'search string',
    description: 'search cart item by name and etc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    example: 1,
    description: 'Index of the page to retrieve',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string))
  pageIndex?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string))
  pageSize?: number = 10;

  @IsOptional()
  @ApiProperty({
    example: CartItemsSortField.UpdatedAt,
    description: 'Field to sort users by',
    enum: CartItemsSortField,
    required: false,
    default: CartItemsSortField.UpdatedAt,
  })
  @IsEnum(CartItemsSortField)
  sortField?: CartItemsSortField = CartItemsSortField.UpdatedAt;

  @ApiProperty({
    example: OrderBy.Descending,
    description: 'Sort order',
    enum: OrderBy,
    required: false,
    default: OrderBy.Descending,
  })
  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy = OrderBy.Descending;

  @ApiProperty({
    example: 0,
    description: 'Minimum price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  priceFrom?: number;

  @ApiProperty({
    example: 100,
    description: 'Maximum price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  priceTo?: number;

  @ApiProperty({
    example: 0,
    description: 'Minimum reviews count',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string))
  reviewsCountFrom?: number;

  @ApiProperty({
    example: 100,
    description: 'Maximum reviews count',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value as string))
  reviewsCountTo?: number;

  @ApiProperty({
    example: 0,
    description: 'Minimum rating',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  ratingFrom?: number;

  @ApiProperty({
    example: 100,
    description: 'Maximum rating',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  ratingTo?: number;

  @ApiProperty({
    example: ProductCategory.DecorativeCosmetics,
    description: 'Product category',
    enum: ProductCategory,
    required: false,
  })
  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @ApiProperty({
    example: new Date(),
    description: 'The early date when the cart items was added',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updatedDateFrom?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The late date when the cart items was added',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updatedDateTo?: Date;

  get skip(): number {
    const [pageIndex, pageSize] = [this.pageIndex ?? 1, this.pageSize ?? 10];
    return (pageIndex - 1) * pageSize;
  }
}
