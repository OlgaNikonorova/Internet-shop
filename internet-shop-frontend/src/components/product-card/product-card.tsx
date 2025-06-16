import { useState, useEffect, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Product from "../../store/models/product/product";
import { IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAddItemToCartMutation,
} from "../../store/api/cart-api";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../store/slices/cart-slice";
import {
  useAddProductToFavoritesMutation,
  useRemoveProductFromFavoritesMutation,
} from "../../store/api/favorites-api";
import React from "react";
import { refreshFavorites } from "../../store/slices/favorites-slice";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  isInCart: boolean;
  refetchFavorites: () => void;
  refetchCart: () => void;
  removeFromCart: (productId: string) => void;
}

const ProductCard = React.memo(
  ({
    product,
    isFavorite,
    isInCart,
    refetchFavorites,
    refetchCart,
    removeFromCart,
  }: ProductCardProps) => {
    const { id, name, images, description, price } = product;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [addToCart] = useAddItemToCartMutation();
    const [addToFavorites] = useAddProductToFavoritesMutation();
    const [removeFromFavorites] = useRemoveProductFromFavoritesMutation();

    const goldColor = "#D4AF37";
    const goldTwClass = "text-[#D4AF37]";

    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isHovered && images && images.length > 1) {
        interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isHovered, images]);

    const handleAddToCart = async (e: MouseEvent) => {
      e.stopPropagation();
      try {
        if (!isInCart) {
          await addToCart({
            productId: id,
            quantity: 1,
          }).unwrap();
          dispatch(addCartItem(1));
        } else {
          removeFromCart(id);
          dispatch(addCartItem(-1));
        }
        refetchCart();
      } catch (error) {
        console.error("Cart error:", error);
      }
    };

    const handleToggleFavorite = async (e: MouseEvent) => {
      e.stopPropagation();
      try {
        if (!isFavorite) {
          await addToFavorites({ productId: id }).unwrap();
        } else {
          await removeFromFavorites(id).unwrap();
        }

        dispatch(refreshFavorites());
        refetchFavorites();
      } catch (error) {
        console.error("Favorite error:", error);
      }
    };

    return (
      <motion.div
        className="relative bg-white shadow-lg rounded-xl overflow-hidden flex flex-col hover:cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/product/${id}`)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Картинки продукта */}
        <div className="relative w-full aspect-[4/3] overflow-hidden group">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentImageIndex}
              src={
                (images &&
                  images.length > 0 &&
                  `${process.env.REACT_APP_API_BASE_URL}${images[currentImageIndex]}`) ||
                "/images/placeholder.webp"
              }
              alt={name}
              className="absolute w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              loading="lazy"
            />
          </AnimatePresence>

          {isHovered && (
            <>
              <div className="absolute inset-0 bg-black/10 transition-all duration-300" />
              <motion.div
                className="absolute top-3 right-3"
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
                    className="!p-2 !bg-white/90 hover:!bg-black/90 !shadow-md"
                    sx={{ zIndex: 10 }}
                  >
                    {isFavorite ? (
                      <Favorite className="text-red-500 hover:text-white" />
                    ) : (
                      <FavoriteBorder className="text-gray-600 hover:text-white" />
                    )}
                  </IconButton>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>

        {/* Информация о продукте*/}
        <div className="p-4 space-y-2">
          <motion.div
            animate={{ color: isHovered ? goldColor : "#333333" }}
            transition={{ duration: 0.2 }}
          >
            <h3
              className={`text-xl font-bold truncate ${
                isHovered ? goldTwClass : ""
              }`}
            >
              {name}
            </h3>
            <p
              className={`text-sm text-gray-600 line-clamp-2 ${
                isHovered ? goldTwClass : ""
              }`}
            >
              {description}
            </p>
          </motion.div>

          <div className="flex justify-between items-center pt-2">
            <motion.p
              animate={{ color: isHovered ? goldColor : "#111827" }}
              className="font-bold text-lg"
            >
              {price.toFixed(2)} ₽
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-3 right-3 z-10"
            >
              <IconButton
                onClick={handleAddToCart}
                className={`!p-2 backdrop-blur ${
                  isInCart
                    ? "!bg-black !bg-opacity-60 text-white"
                    : "!bg-white !bg-opacity-80 hover:!bg-black hover:!bg-opacity-60"
                }`}
                size="medium"
              >
                <ShoppingCart
                  className={
                    isInCart ? "text-white" : "text-gray-800 hover:text-white"
                  }
                  fontSize="small"
                />
              </IconButton>
            </motion.div>
          </div>
        </div>

        {/* Индикатор в корзине */}
        {isInCart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.05,
              ease: "easeOut",
            }}
            className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs font-light
     px-3 py-1 rounded-full z-10 backdrop-blur"
          >
            В корзине
          </motion.div>
        )}
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.isInCart === nextProps.isInCart
    );
  }
);

export default ProductCard;
