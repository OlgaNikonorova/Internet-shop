import { useState } from "react";
import { useGetPaginatedProductsQuery } from "../../store/api/products-api";
import Product from "../../store/models/product/product";
import { Order } from "../../store/models/order";
import { useTypedSelector } from "../../store/hooks";
import {
  pageIndexSelector,
  updatePageIndex,
} from "../../store/slices/shop-slice";
import { useDispatch } from "react-redux";

export const useShopPage = () => {
  const dispatch = useDispatch();
  const pageIndex = useTypedSelector(pageIndexSelector);
  const [pageSize, setPageSize] = useState(8);
  const [sort, setSort] = useState<{ field: keyof Product; order: Order }[]>([
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
      pageIndex,
      pageSize,
      sort,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handlePageChange = (newPageIndex: number) => {
    dispatch(updatePageIndex(newPageIndex));
  };

  return { products, page, isLoading, error, handlePageChange };
};
