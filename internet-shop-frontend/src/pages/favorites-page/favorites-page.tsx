import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetPaginatedFavoriteProductsQuery,
  useClearFavoritesMutation,
} from "../../store/api/favorites-api";
import { Order } from "../../store/models/order";
import PaginatedFavoriteProductsRequest from "../../store/models/favorites/paginated-favorite-products-request";
import ProductCard from "../../components/product-card/product-card";

const FavoritesPage = () => {
  const [params, setParams] = useState<PaginatedFavoriteProductsRequest>({
    pageIndex: 1,
    pageSize: 12,
    orderBy: Order.DESCENDING,
    sortField: "updatedAt",
  });

  const {
    data: { products = [] } = {},
    isLoading,
    isError,
    refetch,
  } = useGetPaginatedFavoriteProductsQuery(params, {
    refetchOnMountOrArgChange: true,
  });

  const [clearFavorites] = useClearFavoritesMutation();

  const handleClearAll = async () => {
    await clearFavorites();
    refetch();
  };

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red">Ошибка загрузки</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="text-4xl text-gray mb-2">♡</div>
        <h2 className="text-xl font-semibold text-gray">
          Ваш список избранного пуст
        </h2>
        <p className="text-gray">Добавляйте товары, чтобы не потерять их</p>
        <Link to="/shop">
          <button className="mt-4 border px-4 py-2 rounded bg-gray">
            Перейти к товарам
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex flex-col justify-between gap-4 items-start md:items-center">
          <h1 className="text-2xl font-bold">Избранное</h1>

          <button
            className="border px-3 py-2 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={handleClearAll}
            disabled={products.length === 0}
          >
            Очистить всё
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
