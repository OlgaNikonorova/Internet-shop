import { Link, useLocation } from "react-router-dom";
import { useTypedSelector } from "../../store/hooks";
import {
  avatarSelector,
  usernameSelector,
  selectUserRole
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

interface HeaderProps {
  onCartClick: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const username = useTypedSelector(usernameSelector);
  const userRole = useTypedSelector(selectUserRole);
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

  const isSeller = userRole === UserRole.SELLER;

  console.log(userRole);

  const isActiveRoute = (path: string) => pathname.startsWith(path);

  return (
    <header className="z-10 bg-black/15 text-white shadow-md sticky top-0 left-0 right-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/shop" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">SOBACCINI</span>
        </Link>

        {/* Основная навигация */}
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8">
            {/* Общие ссылки для всех */}
            <NavLink to="#catalog" active={isActiveRoute('/shop')}>
              Каталог
            </NavLink>
            <NavLink to="/about" active={isActiveRoute('/about')}>
              Новинки
            </NavLink>
            <NavLink to="/contacts" active={isActiveRoute('/contacts')}>
              Бренды
            </NavLink>

            {/* Ссылки только для продавцов */}
            {isSeller && (
              <>
              <Link to="/seller/products">Мои товары</Link>
                <NavLink 
                  to="/seller/products" 
                  active={isActiveRoute('/seller/products')}
                  icon={<Inventory fontSize="small" />}
                >
                  Мои товары
                </NavLink>
                <NavLink 
                  to="/seller/products/create" 
                  active={isActiveRoute('/seller/products/create')}
                  icon={<AddBox fontSize="small" />}
                >
                  Добавить товар
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <NavIcon 
              to="/favorites" 
              icon={<Favorite fontSize="medium" />}
              badge={null}
            />
            
              <span className="absolute -top-1 -right-1 bg-red text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
              <ShoppingCart fontSize="medium" />

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

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
}

const NavLink = ({ to, children, active = false, icon }: NavLinkProps) => (
  <Link 
    to={to} 
    className={`flex items-center gap-1 text-lg hover:text-gray-300 transition-colors ${
      active ? 'font-semibold text-white' : 'text-gray-200'
    }`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {children}
  </Link>
);

interface NavIconProps {
  icon: React.ReactNode;
  badge?: number | null;
  to?: string;
  onClick?: () => void;
}

const NavIcon = ({ icon, badge = null, to, onClick }: NavIconProps) => {
  const content = (
    <button 
      className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
      onClick={onClick}
    >
      {badge !== null && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
      {icon}
    </button>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

interface UserButtonProps {
  username: string | null;
}

const UserButton = ({ username }: UserButtonProps) => (
  <Link 
    to="/profile" 
    className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
  >
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-medium">
      {username?.charAt(0).toUpperCase() || 'U'}
    </div>
    <span className="hidden md:inline">{username || 'Профиль'}</span>
  </Link>
);

export default Header;