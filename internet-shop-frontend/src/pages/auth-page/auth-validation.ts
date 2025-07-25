import { z } from "zod";
import { UserRole } from "../../store/models/user/user-role";
import { AuthMode } from "./auth-mode";

export const loginSchema = z.object({
  username: z.string().min(3, "Псевдоним должен быть не менее 3 символов"),
  password: z
    .string()
    .min(8, "Пароль должен содержать не менее 8 символов")
    .regex(/[a-zA-Z]/, "Пароль должен содержать хотя бы одну букву A-Z"),
});

export const registerSchema = loginSchema.extend({
  email: z
    .string()
    .regex(/^\S+@\S+\.\S+$/, "Введите корректную электронную почту"),
  name: z
    .string()
    .min(3, "Имя и фамилия должны иметь не менее 3 символов")
    .regex(
      /^[A-ZА-ЯЁ][a-zа-яё]+\s[A-ZА-ЯЁ][a-zа-яё]+$/,
      "Имя и фамилия должны начинаться с заглавной буквы"
    ),
  address: z.string().min(10, "Адрес должен быть не менее 10 символов"),
  phone: z
    .string()
    .regex(
      /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[ ]?)?\(?\d{3,5}\)?[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}(([ ]?\d{1})?[ ]?\d{1})?$/,
      "Введите корректный номер телефона"
    ),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Выберите корректную роль" }),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .regex(/^\S+@\S+\.\S+$/, "Введите корректную электронную почту"),
  username: z.string().min(3, "Псевдоним должен быть не менее 3 символов"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type FormData =
  | LoginFormData
  | RegisterFormData
  | ForgotPasswordFormData;

export const getSchema = (mode: AuthMode) => {
  switch (mode) {
    case AuthMode.Login:
      return loginSchema;
    case AuthMode.Register:
      return registerSchema;
    case AuthMode.ForgotPassword:
      return forgotPasswordSchema;
    default:
      return loginSchema;
  }
};
