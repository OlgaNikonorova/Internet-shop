import { useMemo, useState } from "react";
import { useGetPaginatedProductsQuery } from "../../store/api/products-api";
import { Order } from "../../store/models/order";
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

  const {
    data: { products: latestProducts = [] } = {},
    isLoading: isLatestLoading,
    isError: isLatestError,
  } = useGetPaginatedProductsQuery(
    {
      pageSize: 6,
      sort: [{ field: "createdAt", order: Order.DESCENDING }],
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

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

  return {
    products,
    page,
    isLoading,
    isError,
    handleShowMore,
    latestProducts,
    isLatestLoading,
    isLatestError,
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
  };
};
