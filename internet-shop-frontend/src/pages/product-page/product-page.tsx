import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Delete,
  Add,
  Remove,
} from "@mui/icons-material";
import { useProductPage } from "./use-product-page";
import { ProductStatus } from "../../store/models/product/product-status";
import { Button, IconButton } from "@mui/material";
import Review from "../../components/review/review";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import { Thumbs, EffectFade, Autoplay } from "swiper/modules";
import Rating from "../../components/review/rating";
import Counter from "../../components/counter/counter";
import Slider from "../../components/slider/slider";
import { ActionNotification } from "../modal/ActionNotification";
import { ImageModal } from "../modal/ImageModal";

const ProductPage = () => {
  const {
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
    isImageModalOpen,
    setIsImageModalOpen,
    selectedImage,
    setSelectedImage,
    actionNotification,
    setActionNotification,
    handleRemoveFromCart,
    handleUpdateQuantity,
    onDelete,
    onIncrease,
    onDecrease,
    cartItem,
  } = useProductPage();

  const imagesSwiperRef = useRef<{ swiper: SwiperType } | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isProductError || !product || product.status !== ProductStatus.ACTIVE) {
    return (
      <div className="text-center mt-10 py-12 text-white">
        <h2 className="text-2xl font-semibold text-gray-700">
          Товар не найден
        </h2>
        <p className="text-gray mt-2">
          Товар, который вы ищете, может быть удален, или продавец решил
          временно приостановить продажу.
        </p>
      </div>
    );
  }

  const isInStock = product.stock > 0;
  const productImages = product.images ?? [];

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleNextImage = () => {
    if (productImages.length === 0) return;

    setCurrentImageIndex((prev: number) => {
      const newIndex = prev < productImages.length - 1 ? prev + 1 : 0;
      setSelectedImage(productImages[newIndex]);
      return newIndex;
    });
  };

  const handlePrevImage = () => {
    if (productImages.length === 0) return;

    setCurrentImageIndex((prev: number) => {
      const newIndex = prev > 0 ? prev - 1 : productImages.length - 1;
      setSelectedImage(productImages[newIndex]);
      return newIndex;
    });
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Галерея изображений */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {productImages.length > 0 ? (
          <>
            <Button
              onClick={() => imagesSwiperRef.current?.swiper.slidePrev()}
              className="!absolute top-1/2 left-4 -translate-y-1/2 z-10 h-1/2 !bg-black/10"
            >
              <ChevronLeft className="text-white" fontSize="large" />
            </Button>

            <Swiper
              className="h-full"
              ref={imagesSwiperRef}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Thumbs, EffectFade, Autoplay]}
              effect="fade"
              speed={800}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {productImages.map((image, index) => (
                <SwiperSlide
                  key={`${image}-${index}`}
                  className="!flex items-center justify-center"
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onClick={() => handleImageClick(image, index)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <Button
              onClick={() => imagesSwiperRef.current?.swiper.slideNext()}
              className="!absolute top-1/2 right-4 -translate-y-1/2 z-10 h-1/2 !bg-black/10"
            >
              <ChevronRight className="text-white" fontSize="large" />
            </Button>
          </>
        ) : (
          <img
            src="/images/placeholder.webp"
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Миниатюры изображений */}
      {productImages.length > 1 && (
        <div className="mt-2 px-4 w-1/2 self-center">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={5}
            slidesPerView={Math.min(productImages.length, 6)}
            watchSlidesProgress
            modules={[Thumbs]}
            className="h-20"
          >
            {productImages.map((image, index) => (
              <SwiperSlide
                key={`thumb-${image}-${index}`}
                className="cursor-pointer rounded relative overflow-hidden"
              >
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${image}`}
                  alt={`${product.name} thumbnail`}
                  className="w-full h-full object-cover"
                />
                <div className="swiper-thumb-overlay absolute inset-0 bg-black/40 opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Информация о товаре */}
      <div className="text-primary px-10 py-5">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex gap-5">
          <Rating value={product.rating} />
          <p>{reviews.length} оценок</p>
        </div>

        <div className="flex justify-between gap-20 mt-10">
          <div className="flex flex-col">
            <p>{product.description || "Описание товара отсутствует"}</p>
          </div>

          <div className="flex flex-col min-w-[300px] mr-20 gap-8">
            <div className="flex self-center justify-between w-full">
              <span className="text-3xl font-semibold">
                {product.price.toFixed(2)} ₽
              </span>
              <div className="flex flex-col text-center">
                <span className="font-semibold text-lg">
                  {(product.price * 0.8).toFixed(2)} ₽
                </span>
                <span className="text-lg">по скидочной карте</span>
              </div>
            </div>

          {/*Добавление в корзину и в избранное*/}
            <div className="flex justify-between gap-5">
              <div className="flex-1">
                {isInCart && cartItem ? (
                  <div className="flex items-center bg-black rounded-lg overflow-hidden">
                    <IconButton
                      onClick={() => onDecrease(cartItem.id, cartItem.quantity ?? 1)}
                      className="!text-white !p-2 hover:!bg-gray-800"
                      size="small"
                    >
                      <Remove />
                    </IconButton>

                    <span className="flex-1 text-center text-white text-xl">
                      {cartItem.quantity}
                    </span>

                    <IconButton
                      onClick={() => onIncrease(cartItem.id, cartItem.quantity ?? 1)}
                      className="!text-white !p-2 hover:!bg-gray-800"
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                    className="!bg-black !text-white hover:!bg-gray-800 !py-3"
                  >
                    {isAddingToCart
                      ? "Загрузка..."
                      : !isInStock
                      ? "Нет в наличии"
                      : "Добавить в корзину"}
                  </Button>
                )}
              </div>

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
            <div className="flex items-center justify-center text-xl">
            {isInStock && <p>В наличии {product.stock} шт.</p>}
            </div>
          </div>
        </div>

        {/* Отзывы */}
        {!isReviewsError && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-10">Рейтинг и отзывы</h2>
            {reviews.length > 0 ? (
              <div className="flex items-center p-6 justify-between gap-6">
                <div className="flex gap-7">
                  <h3 className="text-5xl font-bold">{product.rating}</h3>
                  <div className="flex flex-col items-center gap-1">
                    <Rating value={product.rating} />
                    <p>{reviews.length} оценок</p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Slider
                    slidesPerView={3}
                    items={reviews}
                    renderItem={(review) => (
                      <Review key={review.id} review={review} />
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="my-8 text-center">Отзывов пока что нет</div>
            )}
          </div>
        )}
      </div>

      {/* Модальное окно изображения */}
      {productImages.length > 0 && (
        <ImageModal
          open={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={selectedImage}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
          hasNext={currentImageIndex < productImages.length - 1}
          hasPrev={currentImageIndex > 0}
        />
      )}

      {/* Уведомление о действиях */}
      <ActionNotification
        open={!!actionNotification}
        onClose={() => setActionNotification(null)}
        message={actionNotification?.message || ""}
        type={actionNotification?.type || "cart"}
      />
    </div>
  );
};

export default ProductPage;
