import { useForm } from "react-hook-form";
import { useAuthPage } from "./use-auth-page";
import { FormData, getSchema} from "./validation";
import { UserRole } from "../../store/models/user/user-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthMode } from "./auth-mode";

const AuthPage = () => {
  const { mode, error, onSubmit, toggleMode } = useAuthPage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(getSchema(mode)),
    defaultValues: {
      role: UserRole.USER,
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {mode === AuthMode.Login ? "Вход" : "Регистрация"}
        </h2>

        {/* Общие поля для обоих режимов */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Логин
            </label>
            <input
              id="username"
              placeholder="Введите ваш логин"
              {...register("username")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              {...register("password")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Поля только для регистрации */}
        {mode === AuthMode.Register && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Введите ваш email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              {"email" in errors && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Имя и фамилия
              </label>
              <input
                id="name"
                placeholder="Иван Иванов"
                {...register("name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              {"name" in errors && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Адрес
              </label>
              <input
                id="address"
                placeholder="Введите ваш адрес"
                {...register("address")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              {"address" in errors && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Телефон
              </label>
              <input
                id="phone"
                placeholder="+7 (999) 123-45-67"
                {...register("phone")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              {"phone" in errors && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Аватар (URL)
              </label>
              <input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatar")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
              {"avatar" in errors && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.avatar?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Роль
              </label>
              <select
                id="role"
                {...register("role")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="user">Покупатель</option>
                <option value="seller">Продавец</option>
              </select>
              {"role" in errors && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role?.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {mode === AuthMode.Login ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          {mode === AuthMode.Login ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-primary hover:text-primary-dark focus:outline-none"
          >
            {mode === AuthMode.Login ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>

        {error && (
          <div className="mt-1 text-sm text-red-600">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthPage;
