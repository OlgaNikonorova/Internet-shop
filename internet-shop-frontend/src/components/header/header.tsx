import { Link } from "react-router-dom";
import { useTypedSelector } from "../../store/hooks";
import { usernameSelector } from "../../store/slices/user-slice";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import { useGetUserCartQuery } from "../../store/api/cart-api";

export interface HeaderProps {
  position?: string;
}

const Header = ({ position = "fixed" }: HeaderProps) => {
  const username = useTypedSelector(usernameSelector);

  const { data: { items: products = [] } = {} } = useGetUserCartQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const cartItemCount = products.length;

  return (
    <header
      className={`bg-transparent text-white shadow-md top-0 left-0 right-0 ${position}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">Sobaccini</span>
        </Link>

        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="hover:text-gray transition-colors">
              Каталог
            </Link>
            <Link to="/about" className="hover:text-gray transition-colors">
              Новинки
            </Link>
            <Link to="/contacts" className="hover:text-gray transition-colors">
              Бренды
            </Link>

            <Link to="/favorites" className="hover:text-gray transition-colors">
              <Favorite fontSize="medium" />
            </Link>
          </div>

          {/* Кнопки корзины и профиля */}
          <div className="flex justify-center items-center gap-4">
            <button
              className="p-2 rounded-full hover:bg-gray transition-colors relative"
              aria-label="Корзина"
            >
              <Link to="/cart">
                <span className="absolute -top-1 -right-1 bg-red text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
                <ShoppingCart fontSize="medium" />
              </Link>
            </button>

            <button
              className="p-2 rounded-full hover:bg-gray transition-colors"
              aria-label="Профиль"
            >
              <Link to="/profile">
                <div>{username}</div>
              </Link>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
