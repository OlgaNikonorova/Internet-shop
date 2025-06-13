import { Link, useLocation } from "react-router-dom";
import { useTypedSelector } from "../../store/hooks";
import { avatarSelector, usernameSelector } from "../../store/slices/user-slice";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import {
  cartItemsCountSelector,
  setCartItemsCount,
} from "../../store/slices/cart-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserCartQuery } from "../../store/api/cart-api";
import { Avatar } from "@mui/material";

interface HeaderProps {
  onCartClick: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const username = useTypedSelector(usernameSelector);
  const avatar = useTypedSelector(avatarSelector);
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

        <nav className="flex items-center gap-[35px]">
          <div className="hidden md:flex items-center gap-[81px]">
            <Link
              to="/shop"
              className="text-xl hover:text-gray transition-colors"
            >
              Каталог
            </Link>
            <Link
              to="/about"
              className="text-xl hover:text-gray transition-colors"
            >
              Новинки
            </Link>
            <Link
              to="/contacts"
              className="text-xl hover:text-gray transition-colors"
            >
              Бренды
            </Link>

            <Link
              to="/favorites"
              className="text-xl hover:text-gray transition-colors"
            >
              <Favorite fontSize="medium" />
            </Link>
          </div>

          {/* Кнопки корзины и профиля */}
          <div className="flex justify-center items-center gap-[30px]">
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
              className="flex gap-3 p-2 text-xl rounded-full hover:bg-gray transition-colors"
              aria-label="Профиль"
            >
              <Link to="/profile">
                <div>{username}</div>
              </Link>
              <Avatar
                src={
                  (avatar &&
                    process.env.REACT_APP_API_BASE_URL + avatar) ||
                  "/default-avatar.png"
                }
                sx={{
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  mx: "auto",
                }}
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
