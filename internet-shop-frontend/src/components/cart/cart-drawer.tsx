import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useGetPaginatedCartItemsProductsQuery,
  useRemoveItemFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../../store/api/cart-api";
import CartItemCard from "../cart-item-card/cart-item-card";
import CartItem from "../../store/models/cart/cart-item";
import PaginatedCartItemsProductsRequest from "../../store/models/cart/paginated-cart-items-products-request";
import { Order } from "../../store/models/order";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../store/slices/cart-slice";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const [deleteCartItem] = useRemoveItemFromCartMutation();
  const dispatch = useDispatch();

  const requestParams: PaginatedCartItemsProductsRequest = {
    sortField: "updatedAt",
    orderBy: Order.DESCENDING,
  };

  const {
    data: { products = [] } = {},
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
      refetch();
      setShowDrawer(true);
      setTimeout(() => setAnimateDrawer(true), 10);
    } else {
      setAnimateDrawer(false);
      const timeout = setTimeout(() => setShowDrawer(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, refetch]);

  const onDecrease = async (cartItemId: string, quantity?: number) => {
    if ((quantity ?? 0) > 1) {
      await updateQuantity({
        cartItemId: cartItemId,
        updateCartItem: { quantity: quantity! - 1 },
      });
    } else {
      await deleteCartItem(cartItemId);
      dispatch(addCartItem(-1));
    }
    refetch();
  };

  const onIncrease = async (cartItemId: string, quantity?: number) => {
    await updateQuantity({
      cartItemId: cartItemId,
      updateCartItem: { quantity: (quantity ?? 0) + 1 },
    });
    refetch();
  };

  const onDelete = async (cartItemId: string) => {
    await deleteCartItem(cartItemId);
    dispatch(addCartItem(-1));
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
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {isLoading ? (
          <div>Загрузка...</div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">Корзина пуста</p>
        ) : (
          <div className="space-y-4">
            {products.map((product: CartItem) => (
              <div
                key={product.id}
                className="relative p-4 rounded shadow-sm bg-gray-50"
              >
                <CartItemCard
                  cartItem={product}
                  onDecrease={onDecrease}
                  onIncrease={onIncrease}
                  onDelete={onDelete}
                />
              </div>
            ))}

            {/* Промокод и итог */}
            <div className="mt-6 border-t pt-4 text-right">
              <button className="px-4 py-2 mb-2 border border-black rounded">
                Ввести промокод
              </button>
              <div className="text-xl font-bold">Итого: 7 659 ₽</div>
              <button className="bg-black text-white px-6 py-3 mt-2 rounded">
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;
