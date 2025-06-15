import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setResetToken } from "../../store/slices/user-slice";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
} from "../../store/api/auth-api";
import {
  FormData,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
} from "./auth-validation";
import { AuthMode } from "./auth-mode";

export const useAuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fetchRegister] = useRegisterUserMutation();
  const [fetchLogin] = useLoginUserMutation();
  const [fetchForgotPassword] = useForgotPasswordMutation();
  const [mode, setMode] = useState<AuthMode>(AuthMode.Login);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (mode === AuthMode.ForgotPassword) {
        const response = await fetchForgotPassword(
          data as ForgotPasswordFormData
        ).unwrap();
        dispatch(setResetToken(response.resetToken));
        navigate("/reset-password");
        return;
      }

      const response = await (mode === AuthMode.Login
        ? fetchLogin(data as LoginFormData)
        : fetchRegister(data as RegisterFormData)
      ).unwrap();

      if (!response.accessToken) throw new Error();

      dispatch(
        login({
          username: data.username,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          role: response.user.role,
          avatar: response.user.avatar ?? null,
          resetToken: null,
        })
      );

      navigate("/shop");
    } catch (error: any) {
      if (mode === AuthMode.ForgotPassword) {
        setError("Не удалось отправить ссылку для восстановления");
        return;
      }
      switch (error.status) {
        case 400:
          setError("Пользователь с такими данными уже существует");
          break;
        case 401:
          setError("Неверный логин или пароль");
          break;
        case 404:
          setError("Пользователь с таким логином не найден");
          break;
        case 500:
          setError("Ошибка сервера. Пожалуйста, попробуйте позже");
          break;
        default:
          setError("Произошла непредвиденная ошибка");
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.Login ? AuthMode.Register : AuthMode.Login);
  };

  const setForgotPasswordMode = () => {
    setMode(AuthMode.ForgotPassword);
  };

  const setLoginMode = () => {
    setMode(AuthMode.Login);
  };

  const setRegisterMode = () => {
    setMode(AuthMode.Register);
  };

  return {
    mode,
    error,
    onSubmit,
    toggleMode,
    setForgotPasswordMode,
    setLoginMode,
    setRegisterMode,
  };
};
