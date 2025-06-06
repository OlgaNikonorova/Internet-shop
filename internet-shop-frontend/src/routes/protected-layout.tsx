import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header/header";
import { useTypedSelector } from "../store/hooks";
import { isAuthSelector } from "../store/slices/user-slice";
import { useState } from "react";
import CartDrawer from "../components/cart/cart-drawer";

export default function ProtectedLayout() {
  const isAuth = useTypedSelector(isAuthSelector);
  const [isCartOpen, setCartOpen] = useState(false);

  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <Outlet />
    </>
  );
}
