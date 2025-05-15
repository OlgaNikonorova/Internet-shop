export default interface CartItem {
  id: string;
  productId: string;
  productName?: string;
  productPrice?: number;
  productCategory?: string;
  productImages?: string[];
  quantity?: number;
  updatedAt?: string;
}