import { Order } from "../order";

export default interface PaginatedFavoriteProductsRequest {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  sortField?: string;
  orderBy?: Order;
  priceFrom?: number;
  priceTo?: number;
  reviewsCountFrom?: number;
  reviewsCountTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  category?: string;
  updatedDateFrom?: Date;
  updatedDateTo?: Date;
}
