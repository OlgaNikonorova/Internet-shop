import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../store/api/products-api";
import { useGetReviewsQuery } from "../../store/api/reviews-api";
import { useAddItemToCartMutation } from "../../store/api/cart-api";
import {
  useAddProductToFavoritesMutation,
  useGetUserFavoritesQuery,
  useRemoveProductFromFavoritesMutation,
} from "../../store/api/favorites-api";
import {
  addCartItem,
  addCartProductId,
  cartProductIdsSelector,
} from "../../store/slices/cart-slice";
import { useState } from "react";
import { useTypedSelector } from "../../store/hooks";

export const useProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const cartProductIds = useTypedSelector(cartProductIdsSelector);
  const dispatch = useDispatch();

  const { data: product, error: isProductError } = useGetProductQuery(id!, {
    refetchOnMountOrArgChange: true,
  });
  const { data: reviews = [], error: isReviewsError } = useGetReviewsQuery(
    id!,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [addToCart, { isLoading: isAddingToCart }] = useAddItemToCartMutation();
  const [addToFavorites, { isLoading: isAddingToFavorites }] =
    useAddProductToFavoritesMutation();

  const { data: products = [], refetch } = useGetUserFavoritesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isInCart = cartProductIds.some((id) => id === product?.id);

  const [removeFromFavorites] = useRemoveProductFromFavoritesMutation();

  const isFavorite = products.some((p) => p.id === product?.id);

  const [count, setCount] = useState(1);

  const handleAddToCart = async () => {
    if (!product) return;

    await addToCart({
      productId: product.id,
      quantity: count,
    });

    setCount(1);

    dispatch(addCartItem(count));
    dispatch(addCartProductId(product.id));
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

    if (isFavorite) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites({ productId: product.id });
    }

    refetch();
  };

  return {
    product,
    isProductError,
    reviews,
    isReviewsError,
    isFavorite,
    isAddingToCart,
    isAddingToFavorites,
    handleAddToCart,
    handleToggleFavorite,
    count,
    setCount,
    isInCart,
  };
};
