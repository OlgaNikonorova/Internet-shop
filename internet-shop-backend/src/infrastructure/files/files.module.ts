import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpeg|png)/)) {
          cb(new Error('Only JPEG and PNG images are allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5,
      },
    }),
  ],
  controllers: [FilesController],
})
export class FilesModule {}
