import Pagination from "../../components/pagination/pagination";
import ProductCard from "../../components/product-card/product-card";
import Product from "../../store/models/product/product";
import { useShopPage } from "./use-shop-page";

const ShopPage = () => {
  const { products, page, isLoading, handlePageChange } = useShopPage();

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="flex w-full flex-col md:flex-row gap-8">
        {/* Основной контент */}
        <div className="w-full">
          {/* Список товаров */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Пагинация */}
              <div className="mt-8">
                <Pagination page={page} onPageChange={handlePageChange} />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
