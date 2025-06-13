import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Псевдоним должен быть не менее 3 символов")
    .nullable(),

  password: z
    .string()
    .min(8, "Пароль должен содержать не менее 8 символов")
    .regex(/[a-zA-Z]/, "Пароль должен содержать хотя бы одну букву")
    .nullable(),

  email: z
    .string()
    .regex(/^\S+@\S+\.\S+$/, "Введите корректную электронную почту")
    .nullable(),

  name: z
    .string()
    .min(3, "Имя и фамилия должны иметь не менее 3 символов")
    .regex(
      /^[A-ZА-ЯЁ][a-zа-яё]+\s[A-ZА-ЯЁ][a-zа-яё]+$/,
      "Имя и фамилия должны начинаться с заглавной буквы и содержать пробел между именем и фамилией"
    )
    .nullable(),

  address: z
    .string()
    .min(10, "Адрес должен быть не менее 10 символов")
    .nullable(),

  phone: z
    .string()
    .regex(
      /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[ ]?)?\(?\d{3,5}\)?[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}[ ]?\d{1}(([ ]?\d{1})?[ ]?\d{1})?$/,
      "Введите корректный номер телефона"
    )
    .nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
