import { ProductStatus } from "./product-status";

export default interface CreateProduct {
  name: string;
  description?: string;
  price: number;
  category: string;
  status: ProductStatus;
  stock: number;
  images?: File[];
}
