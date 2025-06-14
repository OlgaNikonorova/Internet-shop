import { Link, useLocation } from "react-router-dom";
import { useTypedSelector } from "../../store/hooks";
import {
  avatarSelector,
  usernameSelector,
  userRoleSelector,
} from "../../store/slices/user-slice";
import { AddBox, Favorite, Inventory, ShoppingCart } from "@mui/icons-material";
import {
  cartItemsCountSelector,
  setCartItemsCount,
} from "../../store/slices/cart-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserCartQuery } from "../../store/api/cart-api";
import { UserRole } from "../../store/models/user/user-role";
import { Avatar } from "@mui/material";
import NavLink from "../nav/nav-link";
import NavIcon from "../nav/nav-icon";

interface HeaderProps {
  onCartClick: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const username = useTypedSelector(usernameSelector);
  const userRole = useTypedSelector(userRoleSelector);
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

  const isSeller = userRole === UserRole.SELLER;

  const isActiveRoute = (path: string) => pathname.startsWith(path);

  return (
    <header
      className={`z-10 bg-black/15 text-white shadow-md top-0 left-0 right-0 ${getPositionClass()}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/shop" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">SOBACCINI</span>
        </Link>

        {/* Основная навигация */}
        <nav className="flex items-center gap-[35px]">
          <div className="hidden md:flex items-center gap-[81px]">
            {/* Общие ссылки для всех */}
            <NavLink to="/shop" active={isActiveRoute("/shop")}>
              Каталог
            </NavLink>
            <NavLink to="/about" active={isActiveRoute("/about")}>
              Новинки
            </NavLink>
            <NavLink to="/contacts" active={isActiveRoute("/contacts")}>
              Бренды
            </NavLink>

            {/* Ссылки только для продавцов */}
            {isSeller && (
              <>
                <NavLink
                  to="/seller/products"
                  active={isActiveRoute("/seller/products")}
                  icon={<Inventory fontSize="small" />}
                >
                  Мои товары
                </NavLink>
                <NavLink
                  to="/seller/products/create"
                  active={isActiveRoute("/seller/products/create")}
                  icon={<AddBox fontSize="small" />}
                >
                  Добавить товар
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <NavIcon to="/favorites" icon={<Favorite fontSize="medium" />} />

            <div
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <NavIcon icon={<ShoppingCart fontSize="medium" />} />
              {cartItemsCount > 0 && (
                <span onClick={onCartClick} className="absolute top-1 right-1 bg-red-500 text-white text-l rounded-full w-5 h-5 flex items-center justify-center cursor-pointer">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <button
              className="p-2 text-xl rounded-full hover:bg-gray transition-colors"
              aria-label="Профиль"
            >
              <Link className="flex gap-3" to="/profile">
                <div>{username}</div>
                <Avatar
                  src={
                    (avatar && process.env.REACT_APP_API_BASE_URL + avatar) ||
                    "/default-avatar.png"
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    mx: "auto",
                  }}
                />
              </Link>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
