import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Add,
  Remove,
  Star,
  LocalShipping,
  Person,
  Home,
  Diamond as DiamondIcon,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useProductPage } from "./use-product-page";
import { ProductStatus } from "../../store/models/product/product-status";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Rating as MuiRating,
  Paper,
  Tab,
  Tabs,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import Review from "../../components/review/review";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Thumbs, EffectFade, Autoplay } from "swiper/modules";
import { ImageModal } from "../modal/image-modal";
import ProductCard from "../../components/product-card/product-card";
import Slider from "../../components/slider/slider";
import { ActionNotification } from "../modal/action-notification";

const ProductPage = () => {
  const navigate = useNavigate();
  const {
    product,
    refetchProduct,
    isProductError,
    reviews,
    isReviewsError,
    isFavorite,
    isAddingToCart,
    isAddingToFavorites,
    handleAddToCart,
    handleToggleFavorite,
    isInCart,
    isImageModalOpen,
    setIsImageModalOpen,
    actionNotification,
    setActionNotification,
    onIncrease,
    onDecrease,
    cartItem,
    reviewText,
    setReviewText,
    reviewRating,
    setReviewRating,
    isSubmittingReview,
    handleSubmitReview,
    editingReviewId,
    setEditingReviewId,
    refetchReviews,
    isReviewCreatingAllowed,
    ownReviewId,
  } = useProductPage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const imagesSwiperRef = useRef<{ swiper: SwiperType } | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const productWithDefaultRating = product
    ? {
        ...product,
        rating: typeof product.rating === "number" ? product.rating : 0,
      }
    : null;

  const similarProducts = [
    {
      id: "1",
      name: "Похожий товар 1",
      price: 1999,
      rating: 4.5,
      stock: 10,
      status: ProductStatus.ACTIVE,
      category: product?.category || "Категория",
      images: ["/uploads/files-1749991787756-410100815.webp"],
      description: "Описание похожего товара 1",
    },
    {
      id: "2",
      name: "Похожий товар 2",
      price: 2499,
      rating: 4.2,
      stock: 5,
      status: ProductStatus.ACTIVE,
      category: product?.category || "Категория",
      images: ["/uploads/files-1749991787756-410100815.webp"],
      description: "Описание похожего товара 2",
    },
    {
      id: "3",
      name: "Похожий товар 3",
      price: 1799,
      rating: 4.7,
      stock: 8,
      status: ProductStatus.ACTIVE,
      category: product?.category || "Категория",
      images: ["/uploads/files-1749991787756-410100815.webp"],
      description: "Описание похожего товара 3",
    },
    {
      id: "4",
      name: "Похожий товар 4",
      price: 2999,
      rating: 4.9,
      stock: 3,
      status: ProductStatus.ACTIVE,
      category: product?.category || "Категория",
      images: ["/uploads/files-1749991787756-410100815.webp"],
      description: "Описание похожего товара 4",
    },
  ];

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (
    isProductError ||
    !productWithDefaultRating ||
    productWithDefaultRating.status !== ProductStatus.ACTIVE
  ) {
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

  const isInStock = productWithDefaultRating.stock > 0;
  const productImages = productWithDefaultRating.images ?? [];

  const handleNextImage = () => {
    if (productImages.length === 0) return;

    setCurrentImageIndex((prev: number) => {
      const newIndex = prev < productImages.length - 1 ? prev + 1 : 0;
      return newIndex;
    });
  };

  const handlePrevImage = () => {
    if (productImages.length === 0) return;

    setCurrentImageIndex((prev: number) => {
      const newIndex = prev > 0 ? prev - 1 : productImages.length - 1;
      return newIndex;
    });
  };

  const handleSubmitReviewAndClose = async () => {
    await handleSubmitReview();
    refetchProduct();
    refetchReviews();
    setIsReviewFormOpen(false);
  };

  return (
    <div className="flex flex-col bg-white relative">
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 20,
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <Close />
      </IconButton>

      {/* Галерея изображений */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {productImages.length > 0 ? (
          <>
            <Swiper
              className="h-full"
              ref={imagesSwiperRef}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Thumbs, EffectFade, Autoplay]}
              effect="fade"
              speed={500}
            >
              {productImages.map((image, index) => (
                <SwiperSlide
                  key={`${image}-${index}`}
                  className="!flex items-center justify-center"
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${image}`}
                    alt={productWithDefaultRating.name}
                    className="w-full h-full object-cover"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <img
            src="/images/placeholder.webp"
            alt={productWithDefaultRating.name}
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
                  alt={`${productWithDefaultRating.name} thumbnail`}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setCurrentImageIndex(index);
                  }}
                />
                <div className="swiper-thumb-overlay absolute inset-0 bg-black/40 opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Информация о товаре */}
      <div className="text-primary px-15 py-5 m-10">
        <h1 className="text-4xl font-bold mb-4">
          {productWithDefaultRating.name}
        </h1>
        <div className="flex gap-5">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontStyle: "italic",
              fontSize: "1.25rem",
              marginBottom: 4,
            }}
          >
            <MuiRating
              component="span"
              value={parseFloat(productWithDefaultRating.rating.toFixed(1))}
              precision={1}
              readOnly
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "black",
                },
                "& .MuiRating-iconEmpty": {
                  color: "black",
                  opacity: 0.3,
                },
              }}
            />
          </Box>
          <p>
            {reviews.length}{" "}
            {
              ["оценок", "оценка", "оценки"][
                reviews.length % 100 >= 11 && reviews.length % 100 <= 14
                  ? 0
                  : reviews.length % 10 === 1
                  ? 1
                  : reviews.length % 10 >= 2 && reviews.length % 10 <= 4
                  ? 2
                  : 0
              ]
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <Box sx={{ width: "50%" }}>
            <Typography variant="h5">
              {productWithDefaultRating.description ||
                "Описание товара отсутствует"}
            </Typography>
          </Box>

          <div className="lg:w-80 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <Typography variant="h4" fontWeight="bold">
                {productWithDefaultRating.price.toFixed(2)} ₽
              </Typography>
              <div className="flex flex-col items-end">
                <Typography variant="h6" fontWeight="bold">
                  {(productWithDefaultRating.price * 0.8).toFixed(2)} ₽
                </Typography>
                <Typography variant="body1">по скидочной карте</Typography>
              </div>
            </div>

            <Stack direction="row" spacing={2} alignItems="center">
              {isInCart && cartItem ? (
                <div className="flex items-center h-full bg-black rounded-lg overflow-hidden grow">
                  <IconButton
                    onClick={() =>
                      onDecrease(cartItem.id, cartItem.quantity ?? 1)
                    }
                    className="!text-white !p-2 hover:!bg-gray"
                    size="small"
                  >
                    <Tooltip
                      title="Уменьшить количество"
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.3rem",
                          },
                        },
                      }}
                    >
                      <Remove />
                    </Tooltip>
                  </IconButton>

                  <span className="flex-1 text-center text-white text-xl">
                    {cartItem.quantity}
                  </span>

                  <IconButton
                    onClick={() =>
                      onIncrease(cartItem.id, cartItem.quantity ?? 1)
                    }
                    className="!text-white !p-2 hover:!bg-gray"
                    size="small"
                  >
                    <Tooltip
                      title="Увеличить количество"
                      placement="top"
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.3rem",
                          },
                        },
                      }}
                    >
                      <Add />
                    </Tooltip>
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

              <IconButton
                onClick={handleToggleFavorite}
                disabled={isAddingToFavorites}
                className="!p-2 !rounded-full !border !border-black bg-white hover:bg-gray-100 transition"
                size="large"
              >
                <Tooltip
                  title={
                    isFavorite
                      ? "Удалить из избранного"
                      : "Добавить в избранное"
                  }
                  placement="top"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: "1.3rem",
                      },
                    },
                  }}
                >
                  {isFavorite ? (
                    <Favorite className="text-black" fontSize="large" />
                  ) : (
                    <FavoriteBorder className="textblack" fontSize="large" />
                  )}
                </Tooltip>
              </IconButton>
            </Stack>

            <Typography variant="body1" textAlign="center" fontSize="1.1rem">
              {isInStock
                ? `В наличии ${productWithDefaultRating.stock} шт.`
                : "Нет в наличии"}
            </Typography>
          </div>
        </div>

        <div className="mt-10 ml-10">
          {/* Гарантии и доставка */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              mb: 4,
              flexWrap: "wrap",
              gap: 2,
              width: 0.4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ bgcolor: "background.paper", mb: 1, color: "black" }}
              >
                <DiamondIcon color="inherit" />
              </Avatar>
              <Typography variant="body1" textAlign="center" fontSize="1.1rem">
                Гарантия качества продукции
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ bgcolor: "background.paper", mb: 1, color: "black" }}
              >
                <Typography fontWeight="bold" color="inherit">
                  FREE
                </Typography>
              </Avatar>
              <Typography variant="body1" textAlign="center" fontSize="1.1rem">
                Бесплатная доставка от 1500 ₽
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ bgcolor: "background.paper", mb: 1, color: "black" }}
              >
                <Typography fontWeight="bold" color="inherit">
                  RU
                </Typography>
              </Avatar>
              <Typography variant="body1" textAlign="center" fontSize="1.1rem">
                Доставка по всей территории РФ
              </Typography>
            </Box>
          </Box>

          {/* Варианты доставки */}
          <Typography variant="h6" gutterBottom fontSize="1.3rem">
            Способы доставки:
          </Typography>

          <Box sx={{ mb: 4, width: 0.3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid black",
                backgroundColor: "white",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShipping fontSize="small" />
                <Typography fontSize="1.1rem">ПВЗ Sobaccini</Typography>
              </Box>
              <Chip label="завтра" size="medium" />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid black",
                backgroundColor: "white",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person fontSize="small" />
                <Typography fontSize="1.1rem">Курьер</Typography>
              </Box>
              <Chip label="завтра" size="medium" />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid black",
                backgroundColor: "white",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Home fontSize="small" />
                <Typography fontSize="1.1rem">Самовывоз из магазина</Typography>
              </Box>
              <Chip label="завтра" size="medium" />
            </Paper>
          </Box>
        </div>

        <div className="flex flex-col gap-20 m-10">
          <div className="flex flex-col">
            {/* Вкладки с информацией */}
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="product info tabs"
                >
                  <Tab
                    label="Описание"
                    sx={{
                      fontWeight: tabValue === 0 ? "bold" : "normal",
                      "&.Mui-selected": { color: "black" },
                      fontSize: "1.1rem",
                    }}
                  />
                  <Tab
                    label="Состав"
                    sx={{
                      fontWeight: tabValue === 1 ? "bold" : "normal",
                      "&.Mui-selected": { color: "black" },
                      fontSize: "1.1rem",
                    }}
                  />
                  <Tab
                    label="Бренд"
                    sx={{
                      fontWeight: tabValue === 2 ? "bold" : "normal",
                      "&.Mui-selected": { color: "black" },
                      fontSize: "1.1rem",
                    }}
                  />
                  <Tab
                    label="Дополнительная информация"
                    sx={{
                      fontWeight: tabValue === 3 ? "bold" : "normal",
                      "&.Mui-selected": { color: "black" },
                      fontSize: "1.1rem",
                    }}
                  />
                </Tabs>
              </Box>
              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {productWithDefaultRating.name}
                    </Typography>
                    <Typography variant="h6">
                      {productWithDefaultRating.description ||
                        "Описание товара отсутствует"}
                    </Typography>
                  </>
                )}
                {tabValue === 1 && (
                  <Typography variant="h6">
                    Состав товара будет указан здесь
                  </Typography>
                )}
                {tabValue === 2 && (
                  <Typography variant="h6">
                    Информация о бренде будет здесь
                  </Typography>
                )}
                {tabValue === 3 && (
                  <Typography variant="h6">
                    Дополнительная информация о товаре
                  </Typography>
                )}
              </Box>
            </Box>
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      {!isReviewsError && (
        <div className="m-12 mt-2">
          <h2 className="text-2xl font-bold mb-10 text-left">
            Рейтинг и отзывы
          </h2>
          {reviews.length > 0 ? (
            <div className="flex items-center p-6 justify-between gap-6">
              <div className="flex gap-7">
                <h3 className="text-5xl font-bold">
                  {productWithDefaultRating.rating}
                </h3>
                <div className="flex flex-col items-center gap-1">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontStyle: "italic",
                      fontSize: "1.25rem",
                    }}
                  >
                    <MuiRating
                      component="span"
                      value={parseFloat(
                        productWithDefaultRating.rating.toFixed(1)
                      )}
                      precision={1}
                      readOnly
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "black",
                        },
                        "& .MuiRating-iconEmpty": {
                          color: "black",
                          opacity: 0.3,
                        },
                      }}
                    />
                  </Box>
                  <p className="text-lg">
                    {reviews.length}{" "}
                    {
                      ["оценок", "оценка", "оценки"][
                        reviews.length % 100 >= 11 && reviews.length % 100 <= 14
                          ? 0
                          : reviews.length % 10 === 1
                          ? 1
                          : reviews.length % 10 >= 2 && reviews.length % 10 <= 4
                          ? 2
                          : 0
                      ]
                    }
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <Slider
                  slidesPerView={3}
                  items={reviews}
                  renderItem={(review) => (
                    <Review
                      key={review.id}
                      review={review}
                      isOwn={ownReviewId === review.id}
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="my-8 text-center text-xl">
              Отзывов еще нет. Оставьте отзыв первым!
            </div>
          )}

          {isReviewCreatingAllowed && (
            <>
              <div className="text-center my-8">
                <Button
                  variant="outlined"
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="!border-black !text-black hover:!bg-gray-100"
                  sx={{ fontSize: "1.1rem" }}
                >
                  {isReviewFormOpen ? "Скрыть форму отзыва" : "Оставить отзыв"}
                </Button>
              </div>

              {isReviewFormOpen && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">Оставить отзыв</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontStyle: "italic",
                        fontSize: "1.25rem",
                        mb: 3,
                      }}
                    >
                      <MuiRating
                        value={reviewRating}
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            setReviewRating(newValue);
                          }
                        }}
                        precision={1}
                        sx={{
                          fontSize: "1.5rem",
                          "& .MuiRating-iconFilled": {
                            color: "black",
                          },
                          "& .MuiRating-iconEmpty": {
                            color: "black",
                            opacity: 0.3,
                          },
                          "& .MuiRating-icon": {
                            fontStyle: "italic",
                          },
                        }}
                        icon={
                          <Star
                            fontSize="inherit"
                            style={{ fontStyle: "italic" }}
                          />
                        }
                        emptyIcon={
                          <Star
                            fontSize="inherit"
                            style={{ fontStyle: "italic", opacity: 0.3 }}
                          />
                        }
                      />
                    </Box>

                    <textarea
                      className="w-full p-3 border rounded mb-4 min-h-[100px] focus:ring-2 focus:ring-black focus:border-transparent text-xl"
                      placeholder="Напишите ваш отзыв..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitReviewAndClose}
                        disabled={
                          isSubmittingReview ||
                          !reviewText ||
                          reviewRating === 0
                        }
                        className="!bg-black !text-white hover:!bg-gray-800"
                        sx={{ fontSize: "1.1rem" }}
                      >
                        {isSubmittingReview ? "Отправка..." : "Отправить отзыв"}
                      </Button>
                      {editingReviewId && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditingReviewId(null);
                            setReviewText("");
                            setReviewRating(0);
                          }}
                          className="!border-black !text-black"
                          sx={{ fontSize: "1.1rem" }}
                        >
                          Отмена
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="m-12 mt-2">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Похожие товары
            </h2>
            <Slider
              slidesPerView={4}
              items={similarProducts}
              renderItem={(product) => (
                <ProductCard
                  key={productWithDefaultRating.id}
                  product={product}
                  isInCart={false}
                  isFavorite={false}
                  refetchCart={() => {}}
                  refetchFavorites={() => {}}
                  removeFromCart={() => {}}
                />
              )}
            />
          </div>
        </div>
      )}

      {/* Модальное окно изображения */}
      {productImages.length > 0 && (
        <ImageModal
          open={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={productImages[currentImageIndex]}
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
