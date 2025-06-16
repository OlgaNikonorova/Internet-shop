import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useGetUserCartQuery } from "../../store/api/cart-api";
import CartItemCard from "../cart-item-card/cart-item-card";
import CartItem from "../../store/models/cart/cart-item";
import List from "@mui/material/List";
import { useDispatch } from "react-redux";
import { setCartProductIds } from "../../store/slices/cart-slice";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

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
      dispatch(setCartProductIds(products.map((product) => product.productId)));
      setShowDrawer(true);
      setTimeout(() => setAnimateDrawer(true), 10);
    } else {
      setAnimateDrawer(false);
      const timeout = setTimeout(() => setShowDrawer(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, isOpen, products, refetch]);

  const handleApplyPromo = () => {
    if (promoCode === "SOBACCINI10") {
      setDiscount(totalPrice * 0.1);
      setIsPromoApplied(true);
    } else if (promoCode === "SOBACCINI20") {
      setDiscount(totalPrice * 0.2);
      setIsPromoApplied(true);
    } else {
      setDiscount(0);
      setIsPromoApplied(false);
    }
  };

  const handleCheckout = () => {
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const finalPrice = totalPrice - discount;

  if (!showDrawer) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-[720px] bg-white z-50 p-8 overflow-y-auto
        transform transition-transform duration-300 ease-in-out flex flex-col justify-between gap-3
        ${animateDrawer ? "translate-x-0" : "translate-x-full"}
        shadow-xl`}
      >
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-3xl font-light">
            Ваша корзина{" "}
            <span className="font-normal">
              ({products.reduce((acc, item) => acc + (item.quantity ?? 1), 0)}{" "}
              шт.)
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-3xl hover:text-[#C0A062] transition-colors duration-200"
          >
            &times;
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C0A062]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <p className="text-xl">Ваша корзина пуста</p>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <List
              sx={{
                width: "100%",
                position: "relative",
                flexGrow: 1,
                overflowY: "auto",
                gap: 4,
                maxHeight: "40vh",
                padding: "0 8px",
              }}
            >
              {products.map((product: CartItem) => (
                <div key={product.id} className="relative">
                  <CartItemCard
                    cartItem={product}
                    refetchCart={refetch}
                    onNavigateProduct={() => onClose()}
                  />
                </div>
              ))}
            </List>

            {/* Промокод и итог */}
            <div className="mt-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-medium">Промокод</h3>
                  <div className="flex gap-4">
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Введите промокод"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setIsPromoApplied(false);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#E5E7EB",
                          },
                          "&:hover fieldset": {
                            borderColor: "#C0A062",
                          },
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyPromo}
                      disabled={isPromoApplied || !promoCode}
                      sx={{
                        color: isPromoApplied ? "#9CA3AF" : "#C0A062",
                        borderColor: isPromoApplied ? "#9CA3AF" : "#C0A062",
                        "&:hover": {
                          backgroundColor: isPromoApplied
                            ? "transparent"
                            : "rgba(192, 160, 98, 0.08)",
                          borderColor: isPromoApplied ? "#9CA3AF" : "#C0A062",
                        },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isPromoApplied ? "Применено" : "Применить"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-lg">
                  <div className="flex justify-between gap-2">
                    <span>Стоимость товаров:</span>
                    {discount > 0 && (
                      <span className="text-[#C0A062] text-right grow">
                        {finalPrice.toFixed(2)} ₽
                      </span>
                    )}
                    <span
                      className={discount > 0 ? "line-through text-gray" : ""}
                    >
                      {totalPrice.toFixed(2)} ₽
                    </span>
                  </div>
                  <div className="flex justify-between text-2xl font-medium mt-4">
                    <span>Итого:</span>
                    <span>{finalPrice.toFixed(2)} ₽</span>
                  </div>
                </div>

                <Button
                  variant="contained"
                  onClick={handleCheckout}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "12px 24px",
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "#C0A062",
                    },
                  }}
                >
                  Оформить заказ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно успешного оформления */}
      <Dialog
        open={showSuccessModal}
        onClose={closeSuccessModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "black",
            fontSize: "24px",
            fontWeight: "bold",
            paddingBottom: "0",
          }}
        >
          Заказ оформлен!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: "black",
              fontSize: "18px",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            Ваш заказ успешно оформлен. Номер заказа: #
            {Math.floor(Math.random() * 1000000)}.
            <br />
            Мы свяжемся с вами для подтверждения заказа.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "24px" }}>
          <Button
            onClick={closeSuccessModal}
            sx={{
              color: "white",
              backgroundColor: "black",
              padding: "8px 24px",
              "&:hover": {
                backgroundColor: "#C0A062",
              },
            }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>,
    document.body
  );
};

export default CartDrawer;
