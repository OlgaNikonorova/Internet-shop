import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { Product } from '@entities/product.entity';
import { Review } from '@entities/review.entity';
import { User } from '@entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from '@app/reviews/reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
