import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { ProductSortField } from 'src/domain/enums/product-sort-field.enum';

export class ProductSortCriteria {
  @ApiProperty({
    example: ProductSortField.Price,
    description: 'Field to sort by',
    enum: ProductSortField,
  })
  @IsEnum(ProductSortField)
  @IsNotEmpty()
  field: ProductSortField;

  @ApiProperty({
    example: OrderBy.Ascending,
    description: 'Sort order',
    enum: OrderBy,
  })
  @IsEnum(OrderBy)
  @IsNotEmpty()
  order: OrderBy;
}
