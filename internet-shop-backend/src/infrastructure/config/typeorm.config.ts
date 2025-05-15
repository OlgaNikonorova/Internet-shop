import { Favorite } from '@entities/favorite.entity';
import { Review } from '@entities/review.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { CartItem } from 'src/domain/entities/cart-item.entity';
import { Cart } from 'src/domain/entities/cart.entity';
import { Product } from 'src/domain/entities/product.entity';
import { User } from 'src/domain/entities/user.entity';

const migrationsPath = join(process.cwd(), 'migrations/**/*{.ts,.js}');

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    type: 'sqlite',
    database: configService.get<string>('DATABASE_PATH'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    dbName: configService.get<string>('DATABASE_NAME'),
    migrations: [
      configService.get<string>('DATABASE_MIGRATIONS_PATH') ?? migrationsPath,
    ],
    entities: [Product, User, Cart, CartItem, Favorite, Review],
    synchronize: true,
  }),
  inject: [ConfigService],
};
