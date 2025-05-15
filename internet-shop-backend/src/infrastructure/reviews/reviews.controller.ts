import { ReviewsService } from '@app/reviews/reviews.service';
import { GetUserId } from '@common/decorators/get-user-id.decorator';
import { CreateReviewDto } from '@dto/reviews/create-review.dto';
import { ReviewDto } from '@dto/reviews/review.dto';
import { UpdateReviewDto } from '@dto/reviews/update-review.dto';
import { Review } from '@entities/review.entity';
import { IReviewsService } from '@interfaces/reviews.service.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    @Inject(ReviewsService)
    private readonly _reviewsService: IReviewsService,
  ) {}

  @Get(':productId')
  @ApiOperation({
    summary: 'Get reviews for a product',
    operationId: 'getReviews',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews',
    type: ReviewDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getReviews(
    @Param('productId') productId: string,
  ): Promise<ReviewDto[]> {
    const reviews =
      await this._reviewsService.getReviewsByProductIdAsync(productId);
    return reviews.map((review) => this.toDto(review));
  }

  @Get('review/:id')
  @ApiOperation({
    summary: 'Get a review by ID',
    operationId: 'getReviewById',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews',
    type: ReviewDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async getReviewById(
    @Param('id') reviewId: string,
  ): Promise<ReviewDto> {
    const review = await this._reviewsService.getReviewByIdAsync(reviewId);
    return this.toDto(review);
  }

  @Post(':productId')
  @ApiOperation({
    summary: 'Create a review for a product',
    operationId: 'createReview',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review created successfully',
    type: ReviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async createReview(
    @Param('productId') productId: string,
    @GetUserId('userId') userId: string,
    @Body() reviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this._reviewsService.createReviewAsync(
      userId,
      productId,
      reviewDto,
    );

    return this.toDto(review);
  }

  @Patch(':productId')
  @ApiOperation({
    summary: 'Update a review for a product',
    operationId: 'updateReviewByProductId',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async updateReviewByProductId(
    @Param('productId') productId: string,
    @GetUserId('userId') userId: string,
    @Body() reviewDto: UpdateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this._reviewsService.updateReviewByProductIdAsync(
      productId,
      userId,
      reviewDto,
    );

    return this.toDto(review);
  }

  @Patch('review/:id')
  @ApiOperation({
    summary: 'Update a review for a product',
    operationId: 'updateReviewById',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async updateReviewById(
    @Param('id') reviewId: string,
    @GetUserId('userId') userId: string,
    @Body() reviewDto: UpdateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this._reviewsService.updateReviewByIdAsync(
      reviewId,
      userId,
      reviewDto,
    );

    return this.toDto(review);
  }

  @Delete('review/:id')
  @ApiOperation({ summary: 'Delete a review', operationId: 'deleteReviewById' })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async deleteReview(
    @Param('id') reviewId: string,
    @GetUserId('userId') userId: string,
  ): Promise<void> {
    await this._reviewsService.deleteReviewByIdAsync(reviewId, userId);
  }

  @Delete(':productId')
  @ApiOperation({
    summary: 'Delete a review by productId',
    operationId: 'deleteReviewByProductId',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()
  public async deleteReviewByProductId(
    @Param('productId') productId: string,
    @GetUserId('userId') userId: string,
  ): Promise<void> {
    await this._reviewsService.deleteReviewByProductIdAsync(productId, userId);
  }

  private toDto(value: Review): ReviewDto {
    return {
      id: value.id,
      rating: value.rating,
      comment: value.comment,
      userId: value.user.id,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
    };
  }
}
