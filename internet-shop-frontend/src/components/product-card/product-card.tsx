import { useNavigate } from "react-router-dom";
import Product from "../../store/models/product/product";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ProductCard = (props: ProductCardProps) => {
  const { product } = props;
  const { id, name, images, description, price } = product;
  const navigate = useNavigate();

  const handleToProductClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="bg-white border border-white rounded-2xl p-4 shadow-md flex flex-col justify-between cursor-pointer"
      onClick={handleToProductClick}
      style={{ height: "100%" }}
    >
      <img
        src={
          (images &&
            images.length > 0 &&
            process.env.REACT_APP_API_BASE_URL + images[0]) ||
          "/images/placeholder.webp"
        }
        alt={name}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      <h3 className="text-lg font-bold text-primary mb-1">{name}</h3>
      <p className="text-sm text-gray mb-2 break-all">{description}</p>
      <p className="text-primary font-semibold mb-4">{price} ₽</p>
    </div>
  );
};

export default ProductCard;
