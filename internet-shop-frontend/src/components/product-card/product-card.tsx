import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Product from "../../store/models/product/product";
import { IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAddItemToCartMutation } from "../../store/api/cart-api";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../store/slices/cart-slice";
import { useAddProductToFavoritesMutation } from '../../store/api/favorites-api';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  isInCart?: boolean;
  onToggleFavorite?: (productId: string) => Promise<void>;
  // onAddToCart?: (productId: string) => void;
  refetchFavorites: () => void;
  refetchCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  isInCart = false,
  refetchFavorites,
  refetchCart
}) => {
  const { id, name, images, description, price } = product;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [addToCart] = useAddItemToCartMutation();
  const [addToFavorites] = useAddProductToFavoritesMutation();

  const goldColor = "#D4AF37";
  const goldTwClass = "text-[#D4AF37]";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHovered, images]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      await addToCart({
        productId: id,
        quantity: 1,
      }).unwrap();
      dispatch(addCartItem(1));
      refetchCart();
    } catch (error) {
      console.error("Cart error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToFavorites({productId: id}).unwrap();
      refetchFavorites();
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  return (
    <div
      className="relative bg-white shadow-md rounded-lg flex flex-col justify-between hover:cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Product image */}
      <div className="relative w-full h-48 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={
              (images && images.length > 0 && 
               `${process.env.REACT_APP_API_BASE_URL}${images[currentImageIndex]}`) ||
              "/images/placeholder.webp"
            }
            alt={name}
            className="absolute w-full h-full object-cover rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {isHovered && (
          <motion.div 
            className="absolute top-2 right-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={handleToggleFavorite}
                className="!p-2 !bg-white/80 hover:!bg-black"
              >
                {isFavorite ? (
                  <Favorite className="text-red-500 hover:text-white" />
                ) : (
                  <FavoriteBorder className="text-gray-600 hover:text-white" />
                )}
              </IconButton>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Product info with gold text on hover */}
      <div className="p-3 w-full">
        <motion.div
          animate={{ color: isHovered ? goldColor : "#333333" }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <h3 className={`text-lg font-bold mb-1 truncate ${isHovered ? goldTwClass : "text-gray-800"}`}>
            {name}
          </h3>
          <p className={`text-xs mb-2 line-clamp-2 ${isHovered ? goldTwClass : "text-gray-600"}`}>
            {description}
          </p>
          <p className={`font-semibold text-sm ${isHovered ? goldTwClass : "text-gray-900"}`}>
            {price.toFixed(2)} ₽
          </p>
        </motion.div>
      </div>

      {/* Cart button */}
      <div className="absolute bottom-3 right-3 z-10">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`!p-2 ${isInCart ? '!bg-yellow-500' : '!bg-white !border !border-gray-300'} h-10 w-10`}
            size="medium"
          >
            {isAdding ? (
              <div className="animate-spin">🔄</div>
            ) : (
              <ShoppingCart className={isInCart ? 'text-white' : 'text-gray-800'} />
            )}
          </IconButton>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductCard;