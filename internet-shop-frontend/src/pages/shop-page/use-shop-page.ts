import { useState } from "react";
import { useGetPaginatedProductsQuery } from "../../store/api/products-api";
import Product from "../../store/models/product/product";
import { Order } from "../../store/models/order";


export const useShopPage = () => {
  const [pageSize, setPageSize] = useState(8);
  const [sort] = useState<{ field: keyof Product; order: Order }[]>([
    { field: "rating", order: Order.DESCENDING },
  ]);

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
    error,
  } = useGetPaginatedProductsQuery(
    {
      pageSize,
      sort,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleShowMore = () => {
    setPageSize((prev) => prev + 8);
  };

  return { products, page, isLoading, error, handleShowMore
   };
};
