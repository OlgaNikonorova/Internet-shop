import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Header from "./components/header/header";
import RootLayout from "./routes/root-layout";
import PublicLayout from "./routes/public-layout";
import AuthPage from "./pages/auth-page/auth-page";
import ShopPage from "./pages/shop-page/shop-page";
import ProfilePage from "./pages/profile-page/profile-page";
import ProtectedLayout from "./routes/protected-layout";
import ProductPage from "./pages/product-page/product-page";
import FavoritesPage from "./pages/favorites-page/favorites-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";
import CartDrawer from "./components/cart/cart-drawer";
import { useState } from "react";
import CreateProductPage from "./pages/seller/create-product-page";
import { UserRole } from "./store/models/user/user-role";

const publicRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthPage />,
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/favorites",
    element: <FavoritesPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/product/:id",
    element: <ProductPage />,
  },
];

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/shop" replace />,
      },
      {
        element: <PublicLayout />,
        children: publicRoutes,
      },
      {
        element: <ProtectedLayout />,
        children: protectedRoutes,
      },
      {
        element: (
          <ProtectedLayout allowedRoles={[UserRole.SELLER, UserRole.ADMIN]} />
        ),
        children: [
          {
            path: "/seller/products/create",
            element: <CreateProductPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: "/" });

export default function App() {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <RouterProvider router={router}>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </RouterProvider>
  );
}
