import CartItem from "./cart-item";

export default interface Cart {
  id: string;
  items: CartItem[];
  totalPrice: number;
  updatedAt: string;
}