import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetPaginatedFavoriteProductsQuery,
  useClearFavoritesMutation,
} from "../../store/api/favorites-api";
import { Order } from "../../store/models/order";
import PaginatedFavoriteProductsRequest from "../../store/models/favorites/paginated-favorite-products-request";

import CartItem from "../../store/models/cart/cart-item";
import Product from "../../store/models/product/product";

import { Select, MenuItem } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ProductCard from "../../components/product-card/product-card";
import {
  useGetUserCartQuery,
  useRemoveItemFromCartMutation,
} from "../../store/api/cart-api";
import { refreshFavorites } from "../../store/slices/favorites-slice";
import { useDispatch } from "react-redux";

const FavoritesPage = () => {
  const [pageSize, setPageSize] = useState(8);
  const [sortField, setSortField] = useState<keyof CartItem>("updatedAt");
  const [orderBy] = useState<Order>(Order.DESCENDING);

  const dispatch = useDispatch();

  const requestParams: PaginatedFavoriteProductsRequest = {
    pageSize,
    sortField: String(sortField),
    orderBy,
  };

  const {
    data: {
      products = [],
      pageDto: page = {
        pageIndex: 1,
        totalPages: 1,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    } = {},
    isLoading,
    isError,
    refetch: refetchFavorites,
  } = useGetPaginatedFavoriteProductsQuery(requestParams, {
    refetchOnMountOrArgChange: true,
  });

  const { data: { items: cartItems = [] } = {}, refetch: refetchCart } =
    useGetUserCartQuery();

  const [clearFavorites] = useClearFavoritesMutation();
  const [removeFromCart] = useRemoveItemFromCartMutation();

  const handleClearAll = async () => {
    await clearFavorites();
    dispatch(refreshFavorites());
    refetchFavorites();
  };

  const handleShowMore = () => {
    setPageSize((prev) => prev + 8);
  };

  const handleRemoveFromCart = async (productId: string) => {
    const cartItemId = cartItems.find(
      (item) => item.productId === productId
    )?.id;

    if (cartItemId) await removeFromCart(cartItemId);
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
        {/* Заголовок + Очистка */}
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Избранное</h1>
            <span className="text-gray-500 text-sm">{products.length}</span>
          </div>
          <button
            className="border px-3 py-2 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={handleClearAll}
            disabled={products.length === 0}
          >
            Очистить всё
          </button>
        </div>

        {/* Фильтр и сортировка */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <FilterListIcon fontSize="small" />
            <span>Фильтры</span>
          </div>
          <Select
            size="small"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as keyof CartItem)}
          >
            <MenuItem value="updatedAt">по дате добавления</MenuItem>
          </Select>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={true}
              isInCart={cartItems.some((item) => item.productId === product.id)}
              refetchFavorites={refetchFavorites}
              refetchCart={refetchCart}
              removeFromCart={handleRemoveFromCart}
            />
          ))}
        </div>

        {/* Кнопка "Показать больше" если есть следующая страница */}
        {page.hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleShowMore}
              className="border px-6 py-2 rounded hover:bg-gray-100 transition"
            >
              Показать больше
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
