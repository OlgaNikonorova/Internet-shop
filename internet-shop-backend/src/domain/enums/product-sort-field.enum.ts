/**
 * Enum representing the fields by which products can be sorted.
 *
 * @enum {string}
 *
 * @property {string} name - Sort by the product name.
 * @property {string} description - Sort by the product description.
 * @property {string} priceFrom - Sort by the starting price of the product.
 * @property {string} priceTo - Sort by the ending price of the product.
 * @property {string} reviewsCount - Sort by the number of reviews.
 * @property {string} rating - Sort by the rating of the product.
 * @property {string} category - Sort by the product category.
 * @property {string} createdAt - Sort by the earliest creation date.
 * @property {string} updatedAt - Sort by the earliest update date.
 * @property {string} stock - Sort by the product stock.
 *
 */
export enum ProductSortField {
  Name = 'name',
  Description = 'description',
  Price = 'price',
  ReviewsCount = 'reviewsCount',
  Rating = 'rating',
  Category = 'category',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  Stock = 'stock',
}
