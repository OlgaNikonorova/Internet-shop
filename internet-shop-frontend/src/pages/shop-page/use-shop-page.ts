import { useState } from "react";
import { useGetPaginatedProductsQuery } from "../../store/api/products-api";
import { Order } from "../../store/models/order";
import { useGetUserFavoritesQuery } from "../../store/api/favorites-api";
import { useGetUserCartQuery } from "../../store/api/cart-api";

export const useShopPage = () => {
  const [pageSize, setPageSize] = useState(8);

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
  } = useGetPaginatedProductsQuery(
    {
      pageSize,
      sort: [{ field: "rating", order: Order.DESCENDING }],
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

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

  const {data: favoriteProducts = [], refetch: refetchFavorites} = useGetUserFavoritesQuery();
  const {data: {items: cartItems = []} = {}, refetch: refetchCart} = useGetUserCartQuery()

  const handleShowMore = () => {
    setPageSize((prev) => prev + 8);
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
    favoriteProductIds: favoriteProducts.map(product => product.id),
    cartItemIds: cartItems.map(item => item.productId),
    refetchFavorites,
    refetchCart
  };
};
