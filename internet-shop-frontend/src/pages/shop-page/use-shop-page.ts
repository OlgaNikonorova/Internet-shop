import { useMemo, useState } from "react";
import { useGetPaginatedProductsQuery } from "../../store/api/products-api";
import { Order } from "../../store/models/order";
import { useGetUserFavoritesQuery } from "../../store/api/favorites-api";
import {
  useGetUserCartQuery,
  useRemoveItemFromCartMutation,
} from "../../store/api/cart-api";
import { useDebounce } from "../../store/hooks";
import { ProductCategory } from "../../store/models/product/product-category";
import Product from "../../store/models/product/product";

export const useShopPage = () => {
  const [pageSize, setPageSize] = useState(8);
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

  const [removeFromCart] = useRemoveItemFromCartMutation();

  const requestParams = useMemo(
    () => ({
      pageSize,
      search: debouncedSearch,
      sort: [sortOption],
      priceFrom: isPriceFilterEnabled ? priceRange[0] : undefined,
      priceTo: isPriceFilterEnabled ? priceRange[1] : undefined,
      category: category,
      ratingFrom: isRatingFilterEnabled ? ratingRange[0] : undefined,
      ratingTo: isRatingFilterEnabled ? ratingRange[1] : undefined,
    }),
    [
      pageSize,
      debouncedSearch,
      sortOption,
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
      page = {
        pageIndex: 1,
        totalPages: 1,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    } = {},
    isLoading,
    isError,
  } = useGetPaginatedProductsQuery(requestParams, {
    refetchOnMountOrArgChange: true,
  });

  const { data: { products: latestProducts = [] } = {} } =
    useGetPaginatedProductsQuery(
      {
        pageSize: 6,
        sort: [{ field: "createdAt", order: Order.DESCENDING }],
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: favoriteProducts = [], refetch: refetchFavorites } =
    useGetUserFavoritesQuery();
  const { data: { items: cartItems = [] } = {}, refetch: refetchCart } =
    useGetUserCartQuery();

  const handleShowMore = () => {
    setPageSize((prev) => prev + 8);
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

  const handleRemoveFromCart = async (productId: string) => {
    const cartItemId = cartItems.find(
      (item) => item.productId === productId
    )?.id;

    if (cartItemId) await removeFromCart(cartItemId);
  };

  const { data: { products: mayInterestedProducts = [] } = {} } =
    useGetPaginatedProductsQuery(
      {
        pageSize: 6,
        sort: [{ field: "rating", order: Order.DESCENDING }],
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: { products: parfume = [] } = {} } =
    useGetPaginatedProductsQuery(
      {
        pageSize: 6,
        category: ProductCategory.PARFUME,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: { products: care = [] } = {} } = useGetPaginatedProductsQuery(
    {
      pageSize: 6,
      category: ProductCategory.CARE,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: { products: decorativeCosmetics = [] } = {} } =
    useGetPaginatedProductsQuery(
      {
        pageSize: 6,
        category: ProductCategory.DECORATIVE_COSMETICS,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: { products: jewelry = [] } = {} } =
    useGetPaginatedProductsQuery(
      {
        pageSize: 6,
        category: ProductCategory.JEWELRY,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  return {
    products,
    page,
    isLoading,
    isError,
    handleShowMore,
    latestProducts,
    mayInterestedProducts,
    parfume,
    care,
    decorativeCosmetics,
    jewelry,
    favoriteProductIds: favoriteProducts.map((product) => product.id),
    cartItemIds: cartItems.map((item) => item.productId),
    refetchFavorites,
    refetchCart,
    search,
    handleSearch,
    sortOption,
    handleSortChange,
    category,
    handleCategoryToggle,
    priceRange,
    handlePriceChange,
    ratingRange,
    handleRatingChange,
    isPriceFilterEnabled,
    setIsPriceFilterEnabled,
    isRatingFilterEnabled,
    setIsRatingFilterEnabled,
    handleRemoveFromCart,
  };
};
