import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResultDto {
  @ApiProperty({
    description: 'Path to the uploaded file',
    example: '/uploads/products/123456789-image.jpg',
  })
  path: string;
}