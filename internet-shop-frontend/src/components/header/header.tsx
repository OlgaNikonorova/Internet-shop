import { Link } from "react-router-dom";
import { useTypedSelector } from "../../store/hooks";
import { usernameSelector } from "../../store/slices/user-slice";

const Header = () => {
  const username = useTypedSelector(usernameSelector);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">Sobaccini</span>
        </Link>

        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="hover:text-gray transition-colors">
              Магазин
            </Link>
            <Link to="/about" className="hover:text-gray transition-colors">
              О нас
            </Link>
            <Link to="/contacts" className="hover:text-gray transition-colors">
              Контакты
            </Link>
            <Link to="/favorites" className="hover:text-gray transition-colors">
              Избранное
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
                  0
                </span>
              </Link>
            </button>

            <button
              className="p-2 rounded-full hover:bg-gray transition-colors"
              aria-label="Профиль"
            >
              <div>{username}</div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
