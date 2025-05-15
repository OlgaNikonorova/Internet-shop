import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OrderBy } from 'src/domain/enums/order-by.enum';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { UsersSortField } from 'src/domain/enums/users-sort-field.enum';

export class UsersFiltersDto {
  @ApiProperty({
    example: 'search string',
    description: 'search product by name, surname and etc.',
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
    example: UsersSortField.UpdatedAt,
    description: 'Field to sort users by',
    enum: UsersSortField,
    required: false,
    default: UsersSortField.UpdatedAt,
  })
  @IsEnum(UsersSortField)
  sortField?: UsersSortField = UsersSortField.UpdatedAt;

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
    example: UserRole.User,
    description: 'User role',
    enum: UserRole,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    example: new Date(),
    description: 'The early date when the user was registered',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdDateFrom?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The late date when the user was registered',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdDateTo?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The early date when the user was last updated',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updatedDateFrom?: Date;

  @ApiProperty({
    example: new Date(),
    description: 'The late date when the user was last updated',
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
