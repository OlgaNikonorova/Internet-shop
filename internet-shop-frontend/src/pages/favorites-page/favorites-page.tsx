import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetPaginatedFavoriteProductsQuery,
  useClearFavoritesMutation,
} from "../../store/api/favorites-api";
import { Order } from "../../store/models/order";

import CartItem from "../../store/models/cart/cart-item";
import Product from "../../store/models/product/product";

import ProductCard from "../../components/product-card/product-card";
import {
  useGetUserCartQuery,
  useRemoveItemFromCartMutation,
} from "../../store/api/cart-api";
import { refreshFavorites } from "../../store/slices/favorites-slice";
import { useDispatch } from "react-redux";
import { Search } from "../../components/search/search";
import { SortOptions } from "../../components/pagination/sort";
import { Filters } from "../../components/pagination/filters";
import { useDebounce } from "../../store/hooks";
import { ProductCategory } from "../../store/models/product/product-category";

const FavoritesPage = () => {
  const [pageSize, setPageSize] = useState(8);

  const dispatch = useDispatch();

  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
  const [category, setCategory] = useState<ProductCategory | undefined>(
    undefined
  );
  const [sortOption, setSortOption] = useState<{
    field: keyof Product;
    order: Order;
  }>({ field: "rating", order: Order.DESCENDING });

  const [isPriceFilterEnabled, setIsPriceFilterEnabled] = useState(false);
  const [isRatingFilterEnabled, setIsRatingFilterEnabled] = useState(false);

  const requestParams = useMemo(
    () => ({
      pageSize,
      search: debouncedSearch,
      sortField: sortOption.field,
      orderBy: sortOption.order,
      priceFrom: isPriceFilterEnabled ? priceRange[0] : undefined,
      priceTo: isPriceFilterEnabled ? priceRange[1] : undefined,
      category: category,
      ratingFrom: isRatingFilterEnabled ? ratingRange[0] : undefined,
      ratingTo: isRatingFilterEnabled ? ratingRange[1] : undefined,
    }),
    [
      pageSize,
      debouncedSearch,
      sortOption.field,
      sortOption.order,
      isPriceFilterEnabled,
      priceRange,
      category,
      isRatingFilterEnabled,
      ratingRange,
    ]
  );

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

  const handleSearch = (query: string) => {
    setSearch(query);
    setPageSize(8);
  };

  const handleSortChange = (field: keyof Product, order: Order) => {
    setSortOption({ field, order });
    setPageSize(8);
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    setPageSize(8);
  };

  const handleCategoryToggle = (category: ProductCategory) => {
    setCategory(category);
    setPageSize(8);
  };

  const handleRatingChange = (newRange: [number, number]) => {
    setRatingRange(newRange);
    setPageSize(8);
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

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <div className="container mx-auto p-4 my-6">
        {/* Заголовок + Очистка */}
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Избранное</h1>
          </div>
          <button
            className="border px-3 py-2 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            onClick={handleClearAll}
            disabled={products.length === 0}
          >
            Очистить всё
          </button>
        </div>

        <Search search={search} handleSearch={handleSearch} />

        <div className="flex p-5 gap-5 self-start w-full justify-between">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />

          <Filters
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedCategory={category}
            onCategoryToggle={handleCategoryToggle}
            ratingRange={ratingRange}
            onRatingChange={handleRatingChange}
            isPriceFilterEnabled={isPriceFilterEnabled}
            onTogglePriceFilter={(value) => setIsPriceFilterEnabled(value)}
            isRatingFilterEnabled={isRatingFilterEnabled}
            onToggleRatingFilter={(value) => setIsRatingFilterEnabled(value)}
          />
        </div>

        {/* Сетка товаров */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true}
                isInCart={cartItems.some(
                  (item) => item.productId === product.id
                )}
                refetchFavorites={refetchFavorites}
                refetchCart={refetchCart}
                removeFromCart={handleRemoveFromCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-primary">Ничего не найдено</p>
          </div>
        )}

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
