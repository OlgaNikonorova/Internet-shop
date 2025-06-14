import { Order } from "../order";
import Product from "./product";
import { ProductCategory } from "./product-category";
import { ProductStatus } from "./product-status";

export default interface PaginatedProductsRequest {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: { field: keyof Product; order: Order }[];
  priceFrom?: number;
  priceTo?: number;
  reviewsCountFrom?: number;
  reviewsCountTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  category?: ProductCategory;
  status?: ProductStatus;
  createdDateFrom?: Date;
  createdDateTo?: Date;
  updatedDateFrom?: Date;
  updatedDateTo?: Date;
}
