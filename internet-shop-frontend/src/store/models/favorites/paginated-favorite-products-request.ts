import { Order } from "../order";
import Product from "../product/product";

export default interface PaginatedFavoriteProductsRequest {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  sortField?: keyof Product;
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
