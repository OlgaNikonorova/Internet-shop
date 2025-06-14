import "swiper/css";
import "swiper/css/navigation";

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

const ShopPage = () => {
  const {
    products,
    page,
    isLoading,
    handleShowMore,
    latestProducts,
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
  } = useShopPage();

  const promoImages = [
    "/uploads/files-1749583702973-607901801.jpeg",
    "/uploads/files-1749583702973-607901801.jpeg",
    "/uploads/files-1749583702973-607901801.jpeg",
    "/uploads/files-1749583702973-607901801.jpeg",
    "/uploads/files-1749583702973-607901801.jpeg",
  ];

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={10}
      width="100%"
    >
      <Box width="100%">
        <Box
          px={0}
          className="flex flex-col w-full"
          style={{
            backgroundImage: 'url("/images/welcome.jpg")',
            backgroundPosition: "left 27%",
            backgroundSize: "cover",
          }}
        >
          <div className="flex pt-60 px-10 pb-20 flex-col text-white w-1/2 self-end items-start gap-6">
            <h1 className="text-4xl">Красота снаружи начинается внутри.</h1>
            <p className="text-lg">
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
            </p>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Button
                component="a"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("catalog");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                variant="contained"
                sx={{ px: 4, py: 1, width: "100%", mb: 2 }}
              >
                К покупкам!
              </Button>
            </Box>
          </div>
        </Box>

        <div className="flex w-full items-center flex-col gap-10 px-[54px] px-4 py-4">
          <Slider
            title="НОВИНКИ"
            items={latestProducts}
            renderItem={(product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={cartItemIds.some((id) => id === product.id)}
                isFavorite={favoriteProductIds.some((id) => id === product.id)}
                refetchCart={refetchCart}
                refetchFavorites={refetchFavorites}
              />
            )}
          />

          <Slider
            title="АКЦИИ"
            items={promoImages}
            renderItem={(imageSrc, index) => (
              <img
                src={process.env.REACT_APP_API_BASE_URL + imageSrc}
                alt={`promo-${index}`}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            )}
          />

          <SkinTypeSection />

          <Slider
            title="ВАС МОЖЕТ ЗАИНТЕРЕСОВАТЬ"
            items={latestProducts}
            renderItem={(product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={cartItemIds.some((id) => id === product.id)}
                isFavorite={favoriteProductIds.some((id) => id === product.id)}
                refetchCart={refetchCart}
                refetchFavorites={refetchFavorites}
              />
            )}
          />

          {/* Основной контент */}
          <Typography
            id="catalog"
            variant="h4"
            sx={{ marginTop: "10vh" }}
            className="text-white"
          >
            КАТАЛОГ ТОВАРОВ
          </Typography>

          <Search search={search} handleSearch={handleSearch} />

          <div className="flex p-5 gap-5 self-start w-full justify-between">
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
          </div>

          <Box className="w-full">
            {/* Список товаров */}
            {products.length > 0 ? (
              <>
                <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px={10}">
                  {products.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInCart={cartItemIds.some((id) => id === product.id)}
                      isFavorite={favoriteProductIds.some(
                        (id) => id === product.id
                      )}
                      refetchCart={refetchCart}
                      refetchFavorites={refetchFavorites}
                    />
                  ))}
                </Box>

                {page.hasNextPage && (
                  <Box className="mt-8 flex justify-center">
                    <button
                      onClick={handleShowMore}
                      className="border border-white px-6 py-2 rounded transition text-white"
                    >
                      Показать больше
                    </button>
                  </Box>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-white">Ничего не найдено</p>
              </div>
            )}
          </Box>

          <Slider
            title="ПАРФЮМЕРИЯ"
            items={latestProducts}
            renderItem={(product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={cartItemIds.some((id) => id === product.id)}
                isFavorite={favoriteProductIds.some((id) => id === product.id)}
                refetchCart={refetchCart}
                refetchFavorites={refetchFavorites}
              />
            )}
            bgImagePath={
              process.env.REACT_APP_API_BASE_URL +
              "/uploads/files-1749654949798-93558344.jpeg"
            }
          />

          <Slider
            title="УХОДОВАЯ КОСМЕТИКА"
            items={latestProducts}
            renderItem={(product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={cartItemIds.some((id) => id === product.id)}
                isFavorite={favoriteProductIds.some((id) => id === product.id)}
                refetchCart={refetchCart}
                refetchFavorites={refetchFavorites}
              />
            )}
            bgImagePath={
              process.env.REACT_APP_API_BASE_URL +
              "/uploads/files-1749655046735-12483775.jpeg"
            }
          />

          <Slider
            title="УКРАШЕНИЯ"
            items={latestProducts}
            renderItem={(product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={cartItemIds.some((id) => id === product.id)}
                isFavorite={favoriteProductIds.some((id) => id === product.id)}
                refetchCart={refetchCart}
                refetchFavorites={refetchFavorites}
              />
            )}
            bgImagePath={
              process.env.REACT_APP_API_BASE_URL +
              "/uploads/files-1749654782918-410515775.png"
            }
          />
        </div>
      </Box>
    </Box>
  );
};

export default ShopPage;
