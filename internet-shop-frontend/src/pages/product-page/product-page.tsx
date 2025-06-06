import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  useGetPaginatedFavoriteProductsQuery,
  useRemoveProductFromFavoritesMutation,
  useAddProductToFavoritesMutation,
} from "../../store/api/favorites-api";

import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../store/api/products-api";
import { ProductStatus } from "../../store/models/product/product-status";
import { useGetReviewsQuery } from "../../store/api/reviews-api";
import Review from "../../components/review/review";
import ReviewModel from "../../store/models/review/review";
import { useAddItemToCartMutation } from "../../store/api/cart-api";
import { IconButton } from "@mui/material";
import { Order } from "../../store/models/order";
import Product from "../../store/models/product/product";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../store/slices/cart-slice";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
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

  const { data: favoriteData } = useGetPaginatedFavoriteProductsQuery({
    pageIndex: 1,
    pageSize: 1000,
    sortField: "updatedAt",
    orderBy: Order.DESCENDING,
  });

  const favoriteProducts: Product[] = favoriteData?.products || [];

  const [removeFromFavorites] = useRemoveProductFromFavoritesMutation();

  const isFavorite = favoriteProducts.some(
    (p: Product) => p.id === product?.id
  );

  const handleAddToCart = async () => {
    if (!product) return;

    await addToCart({
      productId: product.id,
      quantity: 1,
    });

    dispatch(addCartItem(1));
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

    if (isFavorite) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites({ productId: product.id });
    }
  };

  if (isProductError || !product || product.status !== ProductStatus.ACTIVE) {
    return (
      <div className="text-center py-12 text-white">
        <h2 className="text-2xl font-semibold text-gray-700">
          Product not found
        </h2>
        <p className="text-gray mt-2">
          The product you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={
                (product.images && product.images[0]) ||
                "/placeholder-product.jpg"
              }
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images
                .slice(1)
                .map((image: string | undefined, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded cursor-pointer"
                  />
                ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>

          <div className="flex items-center mt-2 text-white">
            <div>{product.rating}</div>
            <span className="text-white ml-2">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          <div className="mt-4">
            <span className="text-2xl font-semibold text-white">
              {product.price.toFixed(2)} ₽
            </span>
          </div>

          <div className="mt-4">
            <span
              className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-6 text-white">
            <h3 className="text-lg font-medium text-white">Description</h3>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAddingToCart}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-900 text-white"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <IconButton
                onClick={handleToggleFavorite}
                disabled={isAddingToFavorites}
                className="!p-2 !rounded-full !border !border-black bg-white hover:bg-gray-100 transition"
              >
                {isFavorite ? (
                  <Favorite className="text-black" />
                ) : (
                  <FavoriteBorder className="text-black" />
                )}
              </IconButton>
            </div>
          </div>

          <div className="mt-8 border-t border-gray pt-6">
            <h3 className="text-lg font-medium text-white">Details</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-white">
              <div>
                <p className="text-sm text-white">Category</p>
                <p className="text-sm font-medium text-white">
                  {product.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-white">SKU</p>
                <p className="text-sm font-medium text-white">{product.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isReviewsError && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
          {reviews?.length !== 0 ? (
            <div className="flex flex-colgap-6">
              {reviews.map((review: ReviewModel) => (
                <Review key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="mt-4 text-center text-white">
              No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
