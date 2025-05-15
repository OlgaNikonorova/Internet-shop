import Page from "../page";
import Product from "../product/product";

export default interface FavoritesPage {
  products: Product[];
  pageDto: Page;
}
