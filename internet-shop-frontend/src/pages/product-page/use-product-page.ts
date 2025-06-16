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
import { useTypedSelector } from "../../store/hooks";
import { userIdSelector } from "../../store/slices/user-slice";
import {
  NotificationType,
  showNotification,
} from "../../components/notification/notification";

export const useProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const {
    data: product,
    error: isProductError,
    refetch: refetchProduct,
  } = useGetProductQuery(id!, {
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

  const userId = useTypedSelector(userIdSelector);

  const ownReviewId = reviews.find((review) => review.userId === userId)?.id;

  const isReviewCreatingAllowed = !ownReviewId;

  const { data: favoriteProducts = [], refetch: refetchFavorites } =
    useGetUserFavoritesQuery();

  const { data: cartResponse, refetch: refetchCart } = useGetUserCartQuery();
  const cartItems = cartResponse?.items || [];

  const [deleteCartItem] = useRemoveItemFromCartMutation();

  const [addToCart, { isLoading: isAddingToCart }] = useAddItemToCartMutation();
  const [updateCartItem] = useUpdateCartItemQuantityMutation();

  const [addToFavorites, { isLoading: isAddingToFavorites }] =
    useAddProductToFavoritesMutation();
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
      showNotification({
        message: "Отзыв успешно добавлен",
        type: NotificationType.SUCCESS,
      });
    } catch (error) {
      showNotification({
        message: "Ошибка при отправке отзыва",
        type: NotificationType.ERROR,
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
      showNotification({
        message: `Товар "${cartItem?.productName ?? ""}" удален из корзины`,
        type: NotificationType.CART,
      });
    } catch (error) {
      showNotification({
        message: "Ошибка добавления товара в корзину",
        type: NotificationType.ERROR,
      });
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

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({ productId: product.id, quantity: count }).unwrap();
      dispatch(addCartItem(1));
      await refetchCart();
      showNotification({
        message: `Товар "${product.name}" добавлен в корзину`,
        type: NotificationType.CART,
      });
    } catch (error) {
      showNotification({
        message: "Ошибка добавления товара в корзину",
        type: NotificationType.ERROR,
      });
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
        showNotification({
          message: `Товар "${product.name}" удален из избранного`,
          type: NotificationType.FAVORITE,
        });
      } else {
        await addToFavorites({ productId: product.id }).unwrap();
        showNotification({
          message: `Товар "${product.name}" добавлен в избранное`,
          type: NotificationType.FAVORITE,
        });
      }
      refetchFavorites();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return {
    product,
    refetchProduct,
    isProductError: !!isProductError,
    reviews,
    isReviewsError: !!isReviewsError,
    isFavorite,
    isAddingToCart,
    isAddingToFavorites,
    handleAddToCart,
    handleUpdateQuantity,
    handleToggleFavorite,
    count,
    setCount,
    isInCart,
    cartItem,
    isImageModalOpen,
    setIsImageModalOpen,
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
    isReviewCreatingAllowed,
    ownReviewId,
  };
};
