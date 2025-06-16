import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useGetProductQuery } from "../../store/api/products-api";
import {
  useCreateReviewMutation,
  useGetReviewsQuery,
  useUpdateReviewByIdMutation,
} from "../../store/api/reviews-api";
import {
  useAddItemToCartMutation,
  useGetUserCartQuery,
  useRemoveItemFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../../store/api/cart-api";
import {
  useAddProductToFavoritesMutation,
  useGetUserFavoritesQuery,
  useRemoveProductFromFavoritesMutation,
} from "../../store/api/favorites-api";
import { addCartItem } from "../../store/slices/cart-slice";
import CartItem from "../../store/models/cart/cart-item";
import { ActionNotificationType } from "../modal/action-notification-type";

export const useProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [actionNotification, setActionNotification] =
    useState<ActionNotificationType | null>(null);

  const { data: product, error: isProductError } = useGetProductQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: reviews = [],
    error: isReviewsError,
    refetch: refetchReviews,
  } = useGetReviewsQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const { data: favoriteProducts = [], refetch: refetchFavorites } =
    useGetUserFavoritesQuery();

  const { data: cartResponse, refetch: refetchCart } = useGetUserCartQuery();
  const cartItems = cartResponse?.items || [];

  const [deleteCartItem] = useRemoveItemFromCartMutation();

  const [addToCart, { isLoading: isAddingToCart }] = useAddItemToCartMutation();
  const [updateCartItem] = useUpdateCartItemQuantityMutation();

  const [addToFavorites] = useAddProductToFavoritesMutation();
  const [removeFromFavorites] = useRemoveProductFromFavoritesMutation();

  const isFavorite =
    !!product && favoriteProducts.some((p) => p.id === product.id);

  const cartItem = cartItems.find(
    (item: CartItem) => item.productId === product?.id
  );
  const isInCart = !!cartItem && typeof cartItem.quantity === "number";
  const [count, setCount] = useState(cartItem?.quantity || 1);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [addReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewByIdMutation();

  const handleSubmitReview = async () => {
    if (!reviewText || reviewRating === 0 || !product) return;

    setIsSubmittingReview(true);
    try {
      if (editingReviewId) {
        await updateReview({
          reviewId: editingReviewId,
          updateReview: {
            rating: reviewRating,
            comment: reviewText,
          },
        }).unwrap();
      } else {
        await addReview({
          productId: product.id,
          createReview: {
            rating: reviewRating,
            comment: reviewText,
          },
        }).unwrap();
      }

      setReviewText("");
      setReviewRating(0);
      setEditingReviewId(null);
      setActionNotification({
        message: "Отзыв успешно добавлен",
        type: "success",
      });
    } catch (error) {
      setActionNotification({
        message: "Ошибка при отправке отзыва",
        type: "error",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const onDelete = async (cartItemId: string) => {
    try {
      await deleteCartItem(cartItemId).unwrap();
      dispatch(addCartItem(-1));
      await refetchCart();
      setActionNotification({
        message: `Товар удален из корзины`,
        type: "cart",
      });
    } catch (error) {
      console.error("Ошибка удаления из корзины:", error);
      await refetchCart();
    }
  };

  const onIncrease = async (cartItemId: string, quantity: number) => {
    try {
      await updateCartItem({
        cartItemId,
        updateCartItem: { quantity: quantity + 1 },
      }).unwrap();
      await refetchCart();
    } catch (error) {
      console.error("Ошибка увеличения количества:", error);
    }
  };

  const onDecrease = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity > 1) {
        await updateCartItem({
          cartItemId,
          updateCartItem: { quantity: quantity - 1 },
        }).unwrap();
      } else {
        await onDelete(cartItemId);
      }
      await refetchCart();
    } catch (error) {
      console.error("Ошибка уменьшения количества:", error);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({ productId: product.id, quantity: count }).unwrap();
      dispatch(addCartItem(1));
      await refetchCart();
      setActionNotification({
        message: `Товар "${product.name}" добавлен в корзину`,
        type: "cart",
      });
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!product || !cartItem) return;

    try {
      await updateCartItem({
        cartItemId: cartItem.id,
        updateCartItem: {
          quantity: newQuantity,
        },
      }).unwrap();
      await refetchCart();
      setCount(newQuantity);
    } catch (error) {
      console.error("Ошибка обновления количества:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

    try {
      if (isFavorite) {
        await removeFromFavorites(product.id).unwrap();
        setActionNotification({
          message: `Товар "${product.name}" удален из избранного`,
          type: "favorite",
        });
      } else {
        await addToFavorites({ productId: product.id }).unwrap();
        setActionNotification({
          message: `Товар "${product.name}" добавлен в избранное`,
          type: "favorite",
        });
      }
      refetchFavorites();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return {
    product,
    isProductError: !!isProductError,
    reviews,
    isReviewsError: !!isReviewsError,
    isFavorite,
    isAddingToCart,
    isAddingToFavorites: false,
    handleAddToCart,
    handleUpdateQuantity,
    handleToggleFavorite,
    count,
    setCount,
    isInCart,
    cartItem,
    isImageModalOpen,
    setIsImageModalOpen,
    selectedImage,
    setSelectedImage,
    handleImageClick,
    actionNotification,
    setActionNotification,
    refetchCart,
    onDelete,
    onIncrease,
    onDecrease,
    reviewText,
    setReviewText,
    reviewRating,
    setReviewRating,
    isSubmittingReview,
    handleSubmitReview,
    editingReviewId,
    setEditingReviewId,
    refetchReviews,
    navigate,
  };
};
