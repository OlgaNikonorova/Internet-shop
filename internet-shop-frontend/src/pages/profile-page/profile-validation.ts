import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Псевдоним должен быть не менее 3 символов"),

  password: z
    .string()
    .min(8, "Пароль должен содержать не менее 8 символов")
    .regex(/[a-zA-Z]/, "Пароль должен содержать хотя бы одну букву"),

  email: z
    .string()
    .regex(/^\S+@\S+\.\S+$/, "Введите корректную электронную почту"),

  name: z
    .string()
    .min(3, "Имя и фамилия должны иметь не менее 3 символов")
    .regex(
      /^[A-ZА-ЯЁ][a-zа-яё]+\s[A-ZА-ЯЁ][a-zа-яё]+$/,
      "Имя и фамилия должны начинаться с заглавной буквы и содержать пробел между именем и фамилией"
    ),

  address: z
    .string()
    .min(10, "Адрес должен быть не менее 10 символов"),

  phone: z
    .string()
    .regex(
      /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[ ]?)?\(?\d{3,5}\)?[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}(([ ]?\d{1})?[ ]?\d{1})?$/,
      "Введите корректный номер телефона"
    ),

  avatar: z
    .any()
    .refine((file) => !file || file instanceof File, "Файл должен быть изображением")
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Изображение не должно превышать 5MB")
    .refine(
      (file) =>
        !file ||
        /\.(jpe?g|png|gif|webp|svg)$/i.test(file.name),
      "Поддерживаются только изображения: JPG, PNG, GIF, WEBP, SVG"
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
