import { CreateReviewDto } from '@dto/reviews/create-review.dto';
import { UpdateReviewDto } from '@dto/reviews/update-review.dto';
import { Product } from '@entities/product.entity';
import { Review } from '@entities/review.entity';
import { User } from '@entities/user.entity';
import { IReviewsService } from '@interfaces/reviews.service.interface';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService implements IReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly _reviewsRepository: Repository<Review>,

    @InjectRepository(Product)
    private readonly _productsRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}
  public async createReviewAsync(
    userId: string,
    productId: string,
    reviewDto: CreateReviewDto,
  ): Promise<Review> {
    const product = await this._productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this._usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingReview = await this._reviewsRepository.findOneBy({
      user: { id: userId },
      product: { id: productId },
    });

    if (existingReview) {
      throw new BadRequestException('User has already reviewed this product');
    }

    const review = this._reviewsRepository.create({
      ...reviewDto,
      product,
      user,
    });

    await this._reviewsRepository.save(review);

    await this.updateProductRating(productId);

    return review;
  }

  public async getReviewsByProductIdAsync(
    productId: string,
  ): Promise<Review[]> {
    return await this._reviewsRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });
  }

  public async getReviewByIdAsync(reviewId: string): Promise<Review> {
    const review = await this._reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  public async updateReviewByIdAsync(
    reviewId: string,
    userId: string,
    reviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const user = await this._usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingReview = await this._reviewsRepository.findOneBy({
      id: reviewId,
      user: { id: userId },
    });

    if (!existingReview) {
      throw new NotFoundException('Review not found');
    }

    await this._reviewsRepository.save({
      ...existingReview,
      ...reviewDto,
    });

    await this.updateProductRating(existingReview.product.id);

    return existingReview;
  }

  public async updateReviewByProductIdAsync(
    productId: string,
    userId: string,
    reviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const user = await this._usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this._productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingReview = await this._reviewsRepository.findOneBy({
      product: { id: productId },
      user: { id: userId },
    });

    if (!existingReview) {
      throw new NotFoundException('Review not found');
    }

    await this._reviewsRepository.save({
      ...existingReview,
      ...reviewDto,
    });

    await this.updateProductRating(existingReview.product.id);

    return existingReview;
  }

  public async deleteReviewByIdAsync(
    reviewId: string,
    userId: string,
  ): Promise<void> {
    const review = await this._reviewsRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
      relations: ['product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found or not authorized');
    }

    await this._reviewsRepository.remove(review);
    await this.updateProductRating(review.product.id);
  }

  public async deleteReviewByProductIdAsync(
    productId: string,
    userId: string,
  ): Promise<void> {
    const product = await this._productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = await this._reviewsRepository.findOne({
      where: { product: { id: productId }, user: { id: userId } },
      relations: ['product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found or not authorized');
    }

    await this._reviewsRepository.remove(review);
    await this.updateProductRating(review.product.id);
  }

  private async updateProductRating(productId: string): Promise<void> {
    const reviews = await this._reviewsRepository.find({
      where: { product: { id: productId } },
    });

    const reviewsCount = reviews.length;

    const rating =
      reviewsCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount
        : null;

    await this._productsRepository.update(productId, {
      rating: rating !== null ? parseFloat(rating.toFixed(2)) : undefined,
      reviewsCount,
    });
  }
}
