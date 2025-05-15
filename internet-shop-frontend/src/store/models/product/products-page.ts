import Page from "../page";
import Product from "./product";

export default interface ProductsPage {
  products: Product[];
  page: Page;
}
