import Page from "../page";
import CartItem from "./cart-item";

export default interface CartPage {
  products: CartItem[];
  pageDto: Page;
}