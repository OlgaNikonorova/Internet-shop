import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import Product from "../../store/models/product/product";
import { useShopPage } from "./use-shop-page";
import Typography from "@mui/material/Typography";
import Slider from "../../components/slider/slider";
import { Box, Button } from "@mui/material";
import { SkinTypeSection } from "./skin-type-section";
import ProductCard from "../../components/product-card/product-card";
import { Search } from "../../components/search/search";
import { SortOptions } from "../../components/pagination/sort";
import { Filters } from "../../components/pagination/filters";
import { useEffect } from "react";
import { useTypedSelector } from "../../store/hooks";
import { lastUpdatedFavoritesSelector } from "../../store/slices/favorites-slice";
import { SwiperSlide } from "swiper/react";

const ShopPage = () => {
  const navigate = useNavigate();
  const {
    products,
    page,
    isLoading,
    handleShowMore,
    latestProducts,
    mayInterestedProducts,
    care,
    jewelry,
    decorativeCosmetics,
    parfume,
    favoriteProductIds,
    cartItemIds,
    refetchFavorites,
    refetchCart,
    search,
    handleSearch,
    handleCategoryToggle,
    category,
    handlePriceChange,
    priceRange,
    handleSortChange,
    sortOption,
    handleRatingChange,
    ratingRange,
    isPriceFilterEnabled,
    setIsPriceFilterEnabled,
    isRatingFilterEnabled,
    setIsRatingFilterEnabled,
    handleRemoveFromCart,
    handleResetFilters
  } = useShopPage();

  const promoImages = [
    {
      image: "/uploads/files-1750023560621-788358470.webp",
      title: "Скидка 20% на весь уход",
      subtitle: "Только до конца месяца",
      link: "/category/care",
    },
    {
      image: "/uploads/files-1750023560621-802021856.webp",
      title: "Подарок за покупку",
      subtitle: "Бесплатная мини-версия парфюма",
      link: "/category/parfume",
    },
    {
      image: "/uploads/files-1750023560623-426648666.webp",
      title: "Наборы со скидкой",
      subtitle: "Экономия до 35%",
      link: "/category/sets",
    },
    {
      image: "/uploads/files-1750023560623-982391042.webp",
      title: "Бесплатная доставка",
      subtitle: "При заказе от 5000₽",
      link: "/delivery",
    },
  ];

  const lastUpdated = useTypedSelector(lastUpdatedFavoritesSelector);

  useEffect(() => {
    refetchFavorites();
  }, [lastUpdated, refetchFavorites]);

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={8}
      width="100%"
    >
      {/* Hero Section */}
      <Box width="100%">
        <Box
          px={0}
          className="flex flex-col w-full"
          sx={{
            backgroundImage: 'url("/images/welcome.jpg")',
            backgroundPosition: "left 27%",
            backgroundSize: "cover",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(54, 54, 54, 0.3) 20%, transparent 100%)",
            },
          }}
        >
          <Box
            sx={{
              paddingTop: { xs: 20, md: 30 },
              paddingBottom: { xs: 10, md: 10 },
              paddingX: { xs: 4, md: 10 },
              flexDirection: "column",
              color: "white",
              width: { xs: "100%", md: "50%" },
              display: "flex",
              justifyContent: "center",
              alignSelf: "flex-end",
              gap: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Красота снаружи начинается внутри.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                mb: 4,
              }}
            >
              Но знаешь, что самое волшебное? Когда внутренний свет отражается в
              сиянии кожи, в блеске глаз, в уверенной улыбке. Ты — это не просто
              отражение в зеркале. Ты — настроение, энергия, настроение дня,
              которое ты выбираешь сама. Добро пожаловать в мир, где каждая
              баночка, каждая кисть, каждый аромат — это не просто косметика.
              Это твой инструмент для создания себя. Для тех моментов, когда ты
              ловишь на себе восхищённые взгляды. Для тех дней, когда хочется
              чувствовать себя неотразимой без повода. Для вечера, который
              запомнится не только платьем, но и тем, как ты в нём себя ощущала.
              Здесь нет случайных продуктов — только те, что помогут тебе
              раскрыться. Потому что ты заслуживаешь не просто макияжа, а магии.
              Не просто ухода, а ритуала. Не просто покупки, а настроения.
              Выбирай. Вдохновляйся. Сияй.
            </Typography>
            <Button
              variant="contained"
              sx={{
                px: 4,
                py: 1.5,
                width: "fit-content",
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#C0A062",
                  color: "black",
                },
              }}
              onClick={() => {
                const catalog = document.getElementById("catalog");
                if (catalog) {
                  catalog.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              К покупкам!
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1800px",
          px: { xs: 2, md: 6 },
        }}
      >
        {/* Новинки */}
        <Box width="100%" sx={{ mb: 8 }}>
          <Box
            onClick={() => navigate("/new")}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              cursor: "pointer",
              "&:hover h2": {
                color: "#C0A062",
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "3px",
                  backgroundColor: "#C0A062",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              НОВИНКИ
            </Typography>
          </Box>
          <Slider
            items={latestProducts}
            renderItem={(product) => (
              <SwiperSlide
                key={product.id}
                style={{ width: "auto", padding: "0 8px" }}
              >
                <ProductCard
                  product={product}
                  isInCart={cartItemIds.includes(product.id)}
                  isFavorite={favoriteProductIds.includes(product.id)}
                  refetchCart={refetchCart}
                  refetchFavorites={refetchFavorites}
                  removeFromCart={handleRemoveFromCart}
                />
              </SwiperSlide>
            )}
          />
        </Box>

        {/* Акции */}
        <Box width="100%" sx={{ mb: 8 }}>
          <Box
            onClick={() => navigate("/promo")}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              cursor: "pointer",
              "&:hover h2": {
                color: "#C0A062",
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "3px",
                  backgroundColor: "#C0A062",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              АКЦИИ
            </Typography>
          </Box>
          <Slider
            items={promoImages}
            renderItem={(promo, index) => (
              <SwiperSlide
                key={index}
                style={{ width: "auto", padding: "0 8px" }}
              >
                <Box
                  position="relative"
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                      "& .promo-text": {
                        color: "#C0A062",
                      },
                    },
                  }}
                  onClick={() => navigate(promo.link)}
                >
                  <img
                    src={process.env.REACT_APP_API_BASE_URL + promo.image}
                    alt={`promo-${index}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={3}
                    sx={{
                      background:
                        "linear-gradient(to top, rgba(195, 192, 192, 0.8) 0%, transparent 100%)",
                      color: "black",
                    }}
                  >
                    <Typography
                      variant="h5"
                      className="promo-text"
                      sx={{
                        fontWeight: 700,
                        transition: "color 0.3s ease",
                        mb: 1,
                      }}
                    >
                      {promo.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      className="promo-text"
                      sx={{
                        transition: "color 0.3s ease",
                        fontWeight: 500,
                      }}
                    >
                      {promo.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            )}
          />
        </Box>

        <SkinTypeSection />

        {/* Вас может заинтересовать */}
        <Box width="100%" sx={{ mb: 8 }}>
          <Box
            onClick={() => navigate("/promo")}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              cursor: "pointer",
              "&:hover h2": {
                color: "#C0A062",
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "3px",
                  backgroundColor: "#C0A062",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              ВАС МОЖЕТ ЗАИНТЕРЕСОВАТЬ
            </Typography>
          </Box>
          <Slider
            items={mayInterestedProducts}
            renderItem={(product) => (
              <SwiperSlide
                key={product.id}
                style={{ width: "auto", padding: "0 8px" }}
              >
                <ProductCard
                  product={product}
                  isInCart={cartItemIds.includes(product.id)}
                  isFavorite={favoriteProductIds.includes(product.id)}
                  refetchCart={refetchCart}
                  refetchFavorites={refetchFavorites}
                  removeFromCart={handleRemoveFromCart}
                />
              </SwiperSlide>
            )}
          />
        </Box>

        {/* Каталог товаров */}
        <Box width="100%" sx={{ mb: 8 }} id="catalog">
          <Box
            onClick={() => navigate("/promo")}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              cursor: "pointer",
              "&:hover h2": {
                color: "#C0A062",
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "3px",
                  backgroundColor: "#C0A062",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              КАТАЛОГ ТОВАРОВ
            </Typography>
          </Box>

          <Search search={search} handleSearch={handleSearch} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              p: 2,
              mb: 4,
            }}
          >
            <SortOptions
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
            <Filters
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              selectedCategory={category}
              onCategoryToggle={handleCategoryToggle}
              ratingRange={ratingRange}
              onRatingChange={handleRatingChange}
              isPriceFilterEnabled={isPriceFilterEnabled}
              onTogglePriceFilter={(value) => setIsPriceFilterEnabled(value)}
              isRatingFilterEnabled={isRatingFilterEnabled}
              onToggleRatingFilter={(value) => setIsRatingFilterEnabled(value)}
            />
          </Box>

          {/* Список товаров */}
          {products.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInCart={cartItemIds.includes(product.id)}
                    isFavorite={favoriteProductIds.includes(product.id)}
                    refetchCart={refetchCart}
                    refetchFavorites={refetchFavorites}
                    removeFromCart={handleRemoveFromCart}
                  />
                ))}
              </Box>

              {page.hasNextPage && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 6,
                    mb: 4,
                  }}
                >
                  <Button
                    onClick={handleShowMore}
                    variant="outlined"
                    sx={{
                      px: 6,
                      py: 2,
                      borderColor: "#C0A062",
                      color: "#C0A062",
                      borderWidth: 2,
                      fontSize: "1rem",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(212, 175, 55, 0.1)",
                        borderColor: "#C19C30",
                        color: "#C19C30",
                        borderWidth: 2,
                      },
                    }}
                  >
                    Показать больше
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
                Ничего не найдено
              </Typography>
              <Button
                variant="text"
                sx={{
                  color: "#C0A062",
                  fontWeight: 600,
                  "&:hover": {
                    color: "#C19C30",
                  },
                }}
                onClick={handleResetFilters}
              >
                Сбросить фильтры
              </Button>
            </Box>
          )}
        </Box>

        {/* Категории товаров */}
        {[
          {
            title: "ПАРФЮМЕРИЯ",
            items: parfume,
            bgImage: "/uploads/files-1750033607101-711929750.jpeg",
            link: "/category/parfume",
          },
          {
            title: "УХОДОВАЯ КОСМЕТИКА",
            items: care,
            bgImage: "/uploads/files-1750033276324-865290115.jpeg",
            link: "/category/care",
          },
          {
            title: "УКРАШЕНИЯ",
            items: jewelry,
            bgImage: "/uploads/files-1750040301786-71246669.jpeg",
            link: "/category/jewelry",
          },
          {
            title: "ДЕКОРАТИВНАЯ КОСМЕТИКА",
            items: decorativeCosmetics,
            bgImage: "/uploads/files-1750033521553-951601827.jpeg",
            link: "/category/cosmetics",
          },
        ].map((section) => (
          <Box width="100%" key={section.title} sx={{ mb: 8 }}>
            <Box
              onClick={() => navigate(section.link)}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 4,
                cursor: "pointer",
                "&:hover h2": {
                  color: "#C0A062",
                },
                "& img": {
                  width: "100%",
                  height: "60%",
                  objectFit: "cover",
                  opacity: 0.75,
                  display: "block",
                },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  fontWeight: 700,
                  color: "white",
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "3px",
                    backgroundColor: "#C0A062",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                {section.title}
              </Typography>
            </Box>
            <Slider
              items={section.items}
              bgImagePath={process.env.REACT_APP_API_BASE_URL + section.bgImage}
              renderItem={(product) => (
                <SwiperSlide
                  key={product.id}
                  style={{ width: "auto", padding: "0 8px" }}
                >
                  <ProductCard
                    product={product}
                    isInCart={cartItemIds.includes(product.id)}
                    isFavorite={favoriteProductIds.includes(product.id)}
                    refetchCart={refetchCart}
                    refetchFavorites={refetchFavorites}
                    removeFromCart={handleRemoveFromCart}
                  />
                </SwiperSlide>
              )}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShopPage;
