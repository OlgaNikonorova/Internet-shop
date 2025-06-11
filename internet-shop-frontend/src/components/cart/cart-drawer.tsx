import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useGetUserCartQuery } from "../../store/api/cart-api";
import CartItemCard from "../cart-item-card/cart-item-card";
import CartItem from "../../store/models/cart/cart-item";
import List from "@mui/material/List";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const {
    data: { items: products = [], totalPrice = 0 } = {},
    isLoading,
    refetch,
  } = useGetUserCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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
        className={`fixed right-0 top-0 h-screen w-[720px] bg-white z-50 p-6 overflow-y-auto
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${animateDrawer ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex justify-between items-center mb-4 p-5">
          <h2 className="text-2xl">
            Корзина /{" "}
            {products.reduce((acc, item) => acc + (item.quantity ?? 1), 0)} шт.
          </h2>
          <button onClick={onClose} className="text-3xl">
            &times;
          </button>
        </div>

        {isLoading ? (
          <div>Загрузка...</div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray">Корзина пуста</p>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <List
              sx={{
                width: "100%",
                position: "relative",
                overflow: "auto",
                flex: "1 1 auto",
                maxHeight: "55vh",
              }}
            >
              {products.map((product: CartItem) => (
                <div key={product.id} className="relative p-4">
                  <CartItemCard cartItem={product} refetchCart={refetch} />
                </div>
              ))}
            </List>

            {/* Промокод и итог */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between">
                <div className="flex flex-col self-start">
                  <h2 className="text-2xl font-bold mb-4">Сумма заказа</h2>
                  <span>
                    Стоимость продуктов...................
                    {totalPrice.toFixed(2)} ₽
                  </span>
                  <span>
                    Скидка..................................................0 ₽
                  </span>
                </div>

                <button className="text-gray px-4 py-4 mb-2 border border-gray rounded w-fit self-center">
                  ВВЕДИТЕ ПРОМОКОД
                </button>
              </div>

              <div className="text-3xl self-end">
                Итого {totalPrice.toFixed(2)} ₽
              </div>

              <button className="bg-primary text-white px-12 py-3 rounded w-fit self-center">
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
