import { z } from "zod";
import { UserRole } from "../../store/models/user/user-role";
import { AuthMode } from "./auth-mode";

export const loginSchema = z.object({
  username: z.string().min(3, "Псевдоним должен быть не менее 3 символов"),
  password: z
    .string()
    .min(8, "Пароль должен содержать не менее 8 символов")
    .regex(/[a-zA-Z]/, "Пароль должен содержать хотя бы одну букву"),
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
  avatar: z
    .string()
    .url("Некорректный URL изображения")
    .refine(
      (value: string) => /\.(jpe?g|png|gif|webp|svg)$/i.test(value),
      "Поддерживаются только форматы: JPG, PNG, GIF, WEBP, SVG"
    ),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Выберите корректную роль" }),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type FormData = LoginFormData | RegisterFormData;

export const getSchema = (mode: AuthMode) =>
  mode === AuthMode.Login ? loginSchema : registerSchema;
