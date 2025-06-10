import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { FileUploadResultDto } from '@dto/files/file-upload-result.dto';
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole } from 'src/domain/enums/user-role.enum';

@UseGuards(RolesGuard)
@Roles(UserRole.Admin, UserRole.Seller)
@ApiTags('File Upload')
@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image files to upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Files uploaded successfully',
    type: [FileUploadResultDto],
  })
  @ApiBearerAuth()
  public uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): FileUploadResultDto[] {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return files.map((file) => ({
      path: `/uploads/${file.filename}`,
    }));
  }
}
