import { CreateReviewDto } from '@dto/reviews/create-review.dto';
import { UpdateReviewDto } from '@dto/reviews/update-review.dto';
import { Review } from '@entities/review.entity';

export interface IReviewsService {
  /**
   * Creates a review for a product.
   *
   * @param userId - The unique identifier of the user creating the review.
   * @param productId - The unique identifier of the product being reviewed.
   * @param reviewDto - The data transfer object containing the review details.
   * @returns A promise that resolves to the created review.
   */
  createReviewAsync(
    userId: string,
    productId: string,
    reviewDto: CreateReviewDto,
  ): Promise<Review>;

  /**
   * Retrieves all reviews for a product.
   *
   * @param productId - The unique identifier of the product for which to retrieve reviews.
   * @returns A promise that resolves to an array of reviews for the specified product.
   */
  getReviewsByProductIdAsync(productId: string): Promise<Review[]>;

  /**
   * Retrieves a review by its unique identifier.
   *
   * @param reviewId - The unique identifier of the review to retrieve.
   * @returns A promise that resolves to the requested review.
   */
  getReviewByIdAsync(reviewId: string): Promise<Review>;

  /**
   * Updates an existing review.
   *
   * @param reviewId - The unique identifier of the review to update.
   * @param userId - The unique identifier of the user requesting the update.
   * @param reviewDto - A data transfer object containing the updated review details.
   * @returns A promise that resolves to the updated review.
   */
  updateReviewByIdAsync(
    reviewId: string,
    userId: string,
    reviewDto: UpdateReviewDto,
  ): Promise<Review>;

  /**
   * Updates an existing review by product id
   *
   * @param productId - The unique identifier of the product to update its' review.
   * @param userId - The unique identifier of the user requesting the update.
   * @param reviewDto - A data transfer object containing the updated review details.
   * @returns A promise that resolves to the updated review.
   */
  updateReviewByProductIdAsync(
    productId: string,
    userId: string,
    reviewDto: UpdateReviewDto,
  ): Promise<Review>;

  /**
   * Deletes a review by its unique identifier.
   *
   * @param reviewId - The unique identifier of the review to delete.
   * @param userId - The unique identifier of the user requesting the deletion.
   * @returns A promise that resolves when the review is successfully deleted.
   */
  deleteReviewByIdAsync(reviewId: string, userId: string): Promise<void>;

  /**
   * Deletes a review for a product by its unique identifier.
   *
   * @param productId - The unique identifier of the product for which to delete the review.
   * @param userId - The unique identifier of the user requesting the deletion.
   */
  deleteReviewByProductIdAsync(
    productId: string,
    userId: string,
  ): Promise<void>;
}
