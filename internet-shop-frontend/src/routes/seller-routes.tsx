import { Route, Routes, Navigate } from "react-router-dom";
import { useTypedSelector } from "../store/hooks";
import SellerDashboard from "../pages/seller/seller-dashboard";
import SellerProducts from "../pages/seller/seller-products";
import CreateProductPage from "../pages/seller/create-product-page";
import { userRoleSelector } from "../store/slices/user-slice";

const SellerRoutes = () => {
  const userRole = useTypedSelector(userRoleSelector);

  if (userRole !== "seller") {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<SellerDashboard />} />
      <Route path="products" element={<SellerProducts />} />
      <Route path="products/create" element={<CreateProductPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default SellerRoutes;
