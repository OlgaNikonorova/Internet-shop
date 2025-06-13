import { Link, useLocation } from "react-router-dom";
import { useTypedSelector } from "../../store/hooks";
import { usernameSelector } from "../../store/slices/user-slice";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import {
  cartItemsCountSelector,
  setCartItemsCount,
} from "../../store/slices/cart-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserCartQuery } from "../../store/api/cart-api";

interface HeaderProps {
  onCartClick: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const username = useTypedSelector(usernameSelector);
  const cartItemsCount = useTypedSelector(cartItemsCountSelector);
  const dispatch = useDispatch();
  const { data: cart } = useGetUserCartQuery();

  const { pathname } = useLocation();

  useEffect(() => {
    if (cart?.items) {
      const totalCount = cart.items.reduce(
        (acc, item) => acc + (item.quantity ?? 1),
        0
      );
      dispatch(setCartItemsCount(totalCount));
    }
  }, [cart, dispatch]);

  const getPositionClass = () => {
    if (pathname === "/shop" || pathname.startsWith("/product/"))
      return "absolute";
    return "relative";
  };

  return (
    <header
      className={`z-10 bg-black/15 text-white shadow-md top-0 left-0 right-0 ${getPositionClass()}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/shop" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">SOBACCINI</span>
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
              onClick={onCartClick}
            >
              <span className="absolute -top-1 -right-1 bg-red text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
              <ShoppingCart fontSize="medium" />
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
