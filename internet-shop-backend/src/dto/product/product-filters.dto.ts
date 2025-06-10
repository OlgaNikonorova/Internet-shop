import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductCategory } from 'src/domain/enums/product-category.enum';
import { ProductStatus } from 'src/domain/enums/product-status.enum';
import { ProductSortCriteria } from './product-sort-criteria.dto';

export class ProductFiltersDto {
  @ApiProperty({
    description: 'search product by name, description and etc.',
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
    description: 'Array of sort criteria',
    type: [ProductSortCriteria],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => ProductSortCriteria)
  @Transform(({ value }) => {
    const isArray = Array.isArray(value);
    const parsedCriteries = isArray
      ? value?.map((item) => {
          const parsedItem = JSON.parse(item) as ProductSortCriteria;
          return parsedItem;
        })
      : [JSON.parse(value)];

    return parsedCriteries as ProductSortCriteria[];
  })
  sort: ProductSortCriteria[] = [];

  @ApiProperty({
    description: 'Minimum price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  priceFrom?: number;

  @ApiProperty({
    description: 'Maximum price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  priceTo?: number;

  @ApiProperty({
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
    description: 'Minimum rating',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value as string))
  ratingFrom?: number;

  @ApiProperty({
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
    example: ProductStatus.Active,
    description: 'Product status',
    enum: ProductStatus,
    required: false,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({
    description: 'The early date when the product was created',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdDateFrom?: Date;

  @ApiProperty({
    description: 'The late date when the product was created',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdDateTo?: Date;

  @ApiProperty({
    description: 'The early date when the product was last updated',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updatedDateFrom?: Date;

  @ApiProperty({
    description: 'The late date when the product was last updated',
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
