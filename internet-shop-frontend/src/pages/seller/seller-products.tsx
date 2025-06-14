import { useGetProductsQuery } from '../../store/api/products-api';
import ProductList from './products-list';


const SellerProducts = () => {
  const { data: products, isLoading } = useGetProductsQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Products</h1>
      <ProductList products={products || []} />
    </div>
  );
};

export default SellerProducts;