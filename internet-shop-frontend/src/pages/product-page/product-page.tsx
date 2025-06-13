import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { useProductPage } from "./use-product-page";
import { ProductStatus } from "../../store/models/product/product-status";
import { Button, IconButton } from "@mui/material";
import Review from "../../components/review/review";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import { Thumbs } from "swiper/modules";
import Rating from "../../components/review/rating";
import Counter from "../../components/counter/counter";
import Slider from "../../components/slider/slider";

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
  } = useProductPage();

  const imagesSwiperRef = useRef<{ swiper: SwiperType } | null>(null);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (isProductError || !product || product.status !== ProductStatus.ACTIVE) {
    return (
      <div className="text-center py-12 text-white">
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

  return (
    <div className="flex flex-col bg-white">
      <div className="relative w-full h-[60vh] overflow-hidden">
        {product.images && product.images.length > 0 ? (
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
              modules={[Thumbs]}
            >
              {product.images?.map((image) => (
                <SwiperSlide
                  key={image}
                  className="!flex items-center justify-center"
                >
                  <img
                    src={process.env.REACT_APP_API_BASE_URL + image}
                    alt={product.name}
                    className="w-full h-full object-cover"
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

      {product.images && product.images.length > 1 && (
        <div className="mt-2 px-4 w-1/2 self-center">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={5}
            slidesPerView={Math.min(product.images.length, 6)}
            watchSlidesProgress
            modules={[Thumbs]}
            className="h-20"
          >
            {product.images.map((image) => (
              <SwiperSlide
                key={image}
                className="cursor-pointer rounded relative overflow-hidden"
              >
                <img
                  src={process.env.REACT_APP_API_BASE_URL + image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="swiper-thumb-overlay absolute inset-0 bg-black/40 opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <div className="text-primary px-10 py-5">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex gap-5">
          <Rating value={product.rating} />
          <p>{reviews.length} оценок</p>
        </div>

        <div className="flex justify-between gap-20 mt-10">
          <div className="flex flex-col">
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptates repellendus rerum fuga iste sequi non eaque asperiores
              hic reprehenderit voluptas eius corporis eum quis, temporibus nam
              obcaecati architecto molestiae mollitia? Doloribus animi possimus
              earum ex assumenda. Aperiam tenetur sit alias minima beatae totam,
              dicta a doloribus dolore voluptatum ex repellat dolores, delectus
              laudantium quaerat sunt, iste eveniet consectetur animi eligendi
              itaque. Id, quod? Dolorum at quibusdam quod possimus. Sapiente
              quod numquam eos nesciunt saepe accusantium cupiditate dolore
              error optio eligendi?
            </p>
          </div>

          <div className="flex flex-col min-w-[300px] mr-20 gap-8">
            {!isInCart && (
              <Counter
                className="self-center text-2xl"
                count={count}
                onIncrease={() => setCount(count + 1)}
                onDecrease={() => {
                  if (count > 1) setCount(count - 1);
                }}
              />
            )}

            <div className="flex self-center justify-between w-full">
              <span className="text-3xl font-semibold">
                {(product.price * count).toFixed(2)} ₽
              </span>

              <div className="flex flex-col text-center">
                <span className="font-semibold">
                  {(product.price * count).toFixed(2)} ₽
                </span>
                <span>по скидочной карте</span>
              </div>
            </div>

            <div className="flex justify-between gap-5">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || isAddingToCart || isInCart}
                className="px-6 py-3 bg-primary text-white grow disabled:bg-gray"
              >
                {!isInStock
                  ? "Нет в наличии"
                  : isAddingToCart
                  ? "Добавление"
                  : isInCart
                  ? "В корзине"
                  : "Добавить в корзину"}
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

            {isInStock && <p>В наличии {product.stock} шт.</p>}
          </div>
        </div>

        {!isReviewsError && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-10">Рейтинг и отзывы</h2>
            {reviews?.length !== 0 ? (
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
    </div>
  );
};

export default ProductPage;
