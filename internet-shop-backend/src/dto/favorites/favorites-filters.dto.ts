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
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { ProductCategory } from 'src/domain/enums/product-category.enum';
import { ProductSortField } from 'src/domain/enums/product-sort-field.enum';

export class FavoritesFiltersDto {
  @ApiProperty({
    example: 'search string',
    description: 'search favorite product by name, description and etc.',
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

  @IsOptional()
  @ApiProperty({
    example: ProductSortField.UpdatedAt,
    description: 'Field to sort products by',
    enum: ProductSortField,
    required: false,
    default: ProductSortField.UpdatedAt,
  })
  @IsEnum(ProductSortField)
  sortField?: ProductSortField = ProductSortField.UpdatedAt;

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
    example: ProductCategory.Electronics,
    description: 'Product category',
    enum: ProductCategory,
    required: false,
  })
  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @ApiProperty({
    example: new Date(),
    description: 'The early date when the favorite product was added',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdDateFrom?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The late date when the favorite product was added',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdDateTo?: Date;

  get skip(): number {
    const [pageIndex, pageSize] = [this.pageIndex ?? 1, this.pageSize ?? 10];
    return (pageIndex - 1) * pageSize;
  }
}
