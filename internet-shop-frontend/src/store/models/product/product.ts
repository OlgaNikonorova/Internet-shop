import { ProductStatus } from "./product-status";

export default interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: ProductStatus;
  stock: number;
  images?: string[];
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
