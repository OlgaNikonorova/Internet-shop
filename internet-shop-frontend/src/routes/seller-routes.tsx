import { Route, Routes, Navigate } from 'react-router-dom';
import { useTypedSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/slices/user-slice';
import SellerDashboard from '../pages/seller/sellerDashboard';
import SellerProducts from '../pages/seller/sellerProducts';
import CreateProductPage from '../pages/seller/createProductPage';

const SellerRoutes = () => {
  const user = useTypedSelector(selectCurrentUser);

  if (!user || user.role !== 'seller') {
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