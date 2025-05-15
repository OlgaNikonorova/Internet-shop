import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from '@entities/favorite.entity';
import { Product } from '@entities/product.entity';
import { FavoritesService } from '@app/favorites/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Product])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
