import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

/**
 * Represents a paginated response with metadata about the current page,
 * total pages, and navigation predicates.
 */
export class PageDto {
  @ApiProperty({
    example: '1',
    description: 'page index. should be greater or equal to 1',
  })
  @IsNumber()
  pageIndex: number;

  @ApiProperty({
    example: '10',
    description: 'total pages count',
  })
  @IsNumber()
  totalPages: number;

  @ApiProperty({
    example: '300',
    description: 'total records count',
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    example: 'true',
    description: 'has the previous page predicate',
  })
  @IsBoolean()
  hasPreviousPage: boolean;

  @ApiProperty({
    example: 'false',
    description: 'has the next page predicate',
  })
  @IsBoolean()
  hasNextPage: boolean;
}
