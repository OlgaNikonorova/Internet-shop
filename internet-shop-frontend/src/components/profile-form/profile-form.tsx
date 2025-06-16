import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

import { UserRole } from "../../store/models/user/user-role";
import { UserStatus } from "../../store/models/user/user-status";
import UpdateUser from "../../store/models/user/update-user";

const profileFormSchema = z.object({
  email: z.string().email("Некорректный email").min(1, "Обязательное поле"),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .optional(),
  username: z.string().min(3, "Логин должен содержать минимум 3 символа"),
  name: z.string().min(1, "Обязательное поле"),
  address: z.string().min(1, "Обязательное поле"),
  phone: z.string().min(11, "Некорректный номер телефона"),
  avatar: z.string().optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    address: string;
    phone: string;
    avatar: string;
    role: UserRole;
    status: UserStatus;
  };
  onSubmit: (values: UpdateUser) => void;
}

const ProfileForm = ({ user, onSubmit }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.email,
      username: user.username,
      name: user.name,
      address: user.address,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    },
  });

  const avatarUrl = watch("avatar");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: ProfileFormValues) => {
    const updateData: UpdateUser = {
      email: data.email,
      password: data.password || "",
      username: data.username,
      name: data.name,
      address: data.address,
      phone: data.phone,
      avatar: data.avatar || "",
      role: data.role,
      status: data.status,
    };
    onSubmit(updateData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={3}>
        {/* Аватар с возможностью загрузки */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={avatarUrl || "/default-avatar.png"}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        {/* Основные поля формы */}
        <TextField
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
          fullWidth
        />

        <TextField
          label="Пароль"
          type="password"
          error={!!errors.password}
          helperText={
            errors.password?.message || "Оставьте пустым, если не хотите менять"
          }
          {...register("password")}
          fullWidth
        />

        <TextField
          label="Логин"
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register("username")}
          fullWidth
        />

        <TextField
          label="Полное имя"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
          fullWidth
        />

        <TextField
          label="Адрес"
          error={!!errors.address}
          helperText={errors.address?.message}
          {...register("address")}
          fullWidth
          multiline
          rows={2}
        />

        <TextField
          label="Телефон"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register("phone")}
          fullWidth
        />

        {/* Скрытые поля для роли и статуса*/}
        <input type="hidden" {...register("role")} />
        <input type="hidden" {...register("status")} />
        <input type="hidden" {...register("avatar")} />

        <Button type="submit" variant="contained" color="primary" size="large">
          Сохранить изменения
        </Button>
      </Stack>
    </form>
  );
};

export default ProfileForm;
