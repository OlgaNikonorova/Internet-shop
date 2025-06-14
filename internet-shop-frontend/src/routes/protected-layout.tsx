import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/header/header";
import { useTypedSelector } from "../store/hooks";
import { isAuthSelector, userRoleSelector } from "../store/slices/user-slice";
import { useState } from "react";
import CartDrawer from "../components/cart/cart-drawer";
import Footer from "../components/footer/footer";
import { UserRole } from "../store/models/user/user-role";

export interface ProtectedLayoutProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedLayout({
  allowedRoles,
}: ProtectedLayoutProps) {
  const isAuth = useTypedSelector(isAuthSelector);
  const userRole = useTypedSelector(userRoleSelector);
  const [isCartOpen, setCartOpen] = useState(false);

  if (!isAuth || !userRole) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <Outlet />
      <Footer />
    </>
  );
}
