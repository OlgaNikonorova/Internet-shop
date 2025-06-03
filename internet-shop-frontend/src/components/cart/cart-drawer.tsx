import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useGetPaginatedCartItemsProductsQuery,
  useRemoveItemFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../../store/api/cart-api";
import CartItemCard from "../cart-item-card/cart-item-card";
import Pagination from "../pagination/pagination";
import CartItem from "../../store/models/cart/cart-item";
import PaginatedCartItemsProductsRequest from "../../store/models/cart/paginated-cart-items-products-request";
import { Order } from "../../store/models/order";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const [deleteCartItem] = useRemoveItemFromCartMutation();
    
  const requestParams: PaginatedCartItemsProductsRequest = {
    pageIndex: 1,
    pageSize: 100,
    sortField: "updatedAt",
    orderBy: Order.DESCENDING,
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
    refetch,
  } = useGetPaginatedCartItemsProductsQuery(requestParams, {
    refetchOnMountOrArgChange: true,
  });

  const [updateQuantity] = useUpdateCartItemQuantityMutation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const [showDrawer, setShowDrawer] = useState(false);
  const [animateDrawer, setAnimateDrawer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowDrawer(true);
      setTimeout(() => setAnimateDrawer(true), 10); // задержка для плавной анимации появления
    } else {
      setAnimateDrawer(false);
      const timeout = setTimeout(() => setShowDrawer(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

const onDecrease = async (item: CartItem) => {
  if ((item.quantity ?? 0) > 1) {
    await updateQuantity({
      cartItemId: item.id,
      updateCartItem: { quantity: item.quantity! - 1 },
    });
  } else {
    await deleteCartItem(item.id); // Явное удаление
  }
  refetch();
};

  const onIncrease = async (item: CartItem) => {
    await updateQuantity({
      cartItemId: item.id,
      updateCartItem: { quantity: (item.quantity ?? 0) + 1 },
    });
    refetch();
  };

  if (!showDrawer) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[720px] bg-white z-50 p-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${animateDrawer ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold">Корзина / {products.length} шт.</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>

        {isLoading ? (
          <div>Загрузка...</div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">Корзина пуста</p>
        ) : (
          <div className="space-y-4">
            {products.map((product: CartItem) => (
              <div key={product.id} className="relative p-4 rounded shadow-sm bg-gray-50">
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-gray-100 rounded-md px-2 py-1 text-sm">
                  <button
                    onClick={() => onDecrease(product)}
                    className="w-6 h-6 flex justify-center items-center rounded bg-gray-200 hover:bg-gray-300 border-none"
                  >
                    −
                  </button>
                  <span className="min-w-[20px] text-center">{product.quantity}</span>
                  <button
                    onClick={() => onIncrease(product)}
                    className="w-6 h-6 flex justify-center items-center rounded bg-gray-200 hover:bg-gray-300 border-none"
                  >
                    +
                  </button>
                </div>
                <CartItemCard cartItem={product} />
              </div>
            ))}

            {/* Промокод и итог */}
            <div className="mt-6 border-t pt-4 text-right">
              <button className="px-4 py-2 mb-2 border border-black rounded">Ввести промокод</button>
              <div className="text-xl font-bold">Итого: 7 659 ₽</div>
              <button className="bg-black text-white px-6 py-3 mt-2 rounded">Оформить заказ</button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;
