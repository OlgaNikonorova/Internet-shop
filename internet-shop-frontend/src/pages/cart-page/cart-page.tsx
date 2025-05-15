import { useState } from "react";
import { useGetPaginatedCartItemsProductsQuery } from "../../store/api/cart-api";
import { Order } from "../../store/models/order";
import Pagination from "../../components/pagination/pagination";
import CartItem from "../../store/models/cart/cart-item";
import PaginatedCartItemsProductsRequest from "../../store/models/cart/paginated-cart-items-products-request";
import CartItemCard from "../../components/cart-item-card/cart-item-card";

const CartPage = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<keyof CartItem>("updatedAt");
  const [orderBy, setOrderBy] = useState<Order>(Order.DESCENDING);

  const requestParams: PaginatedCartItemsProductsRequest = {
    pageIndex,
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
  } = useGetPaginatedCartItemsProductsQuery(requestParams, {
    refetchOnMountOrArgChange: true,
  });

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Загрузка корзины...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Ошибка загрузки корзины</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray">Ваша корзина</h1>

        {products.length > 0 ? (
          <div className="flex flex-col">
            <div className="w-full max-w-4xl mx-auto">
              <div className="space-y-4">
                {products.map((product) => (
                  <CartItemCard key={product.id} cartItem={product} />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Pagination page={page} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Ваша корзина пуста</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
