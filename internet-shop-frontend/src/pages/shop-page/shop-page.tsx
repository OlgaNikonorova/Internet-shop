import Pagination from "../../components/pagination/pagination";
import ProductCard from "../../components/product-card/product-card";
import Product from "../../store/models/product/product";
import { useShopPage } from "./use-shop-page";

const ShopPage = () => {
  const { products, page, isLoading, handlePageChange } = useShopPage();

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex flex-col w-full"
        style={{
          backgroundImage: 'url("/images/welcome.jpg")',
          backgroundPosition: "left center",
          backgroundSize: "cover",
        }}
      >
        <div className="flex pt-60 px-10 pb-20 flex-col text-white w-1/2 self-end items-start gap-6">
          <h1 className="text-3xl">Красота снаружи начинается внутри.</h1>
          <p className="text-align-start">
            Но знаешь, что самое волшебное? Когда внутренний свет отражается в
            сиянии кожи, в блеске глаз, в уверенной улыбке. Ты — это не просто
            отражение в зеркале. Ты — настроение, энергия, настроение дня,
            которое ты выбираешь сама. Добро пожаловать в мир, где каждая
            баночка, каждая кисть, каждый аромат — это не просто косметика. Это
            твой инструмент для создания себя. Для тех моментов, когда ты ловишь
            на себе восхищённые взгляды. Для тех дней, когда хочется чувствовать
            себя неотразимой без повода. Для вечера, который запомнится не
            только платьем, но и тем, как ты в нём себя ощущала. Здесь нет
            случайных продуктов — только те, что помогут тебе раскрыться. Потому
            что ты заслуживаешь не просто макияжа, а магии. Не просто ухода,
            а ритуала. Не просто покупки, а настроения. Выбирай. Вдохновляйся.
            Сияй.
          </p>
          <button>К покупкам!</button>
        </div>
      </div>

      <div className="flex w-full items-center flex-col gap-8 px-4 py-4">
        {/* Основной контент */}
        <h1 className="text-white text-2xl">Каталог товаров</h1>
        <div className="w-full">
          {/* Список товаров */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Пагинация */}
              <div className="mt-8">
                <Pagination page={page} onPageChange={handlePageChange} />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
