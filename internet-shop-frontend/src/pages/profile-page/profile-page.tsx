import { useState } from "react";
import {
  Container,
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  TextField,
} from "@mui/material";
import {
  useGetMeQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} from "../../store/api/user-api";
import { zodResolver } from "@hookform/resolvers/zod";
import UpdateUser from "../../store/models/user/update-user";
import { Link as RouterLink } from "react-router-dom";
import { ColorButton } from "../../theme";
import { ProfileFormData, profileSchema } from "./profile-validation";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
  const { data: user, isLoading, error, refetch } = useGetMeQuery();
  const [updateUser] = useUpdateUserByIdMutation();
  const [deleteUser] = useDeleteUserByIdMutation();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const handleUpdateProfile = async (updateData: UpdateUser) => {
    if (!user) return;
    try {
      await updateUser({
        id: user.id,
        updateUser: updateData,
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка обновления профиля:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteUser(user.id).unwrap();
      window.location.href = "/";
    } catch (err) {
      console.error("Ошибка удаления аккаунта:", err);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };

      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("avatar", file);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Ошибка загрузки данных пользователя
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Пользователь не найден
      </Alert>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", color: "#000", py: 6 }}>
      <Container sx={{ display: "flex", ml: 15, mr: 15, gap: 25 }}>
        <Box sx={{ minWidth: 330, mr: 4 }}>
          <Box
            sx={{
              display: "flex",
              mb: 2,
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              +7 960-448-52-74
            </Typography>
            <Box
              sx={{
                display: "flex",
                mb: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label htmlFor="avatar-upload">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <Avatar
                  src={avatarPreview || user.avatar || "/default-avatar.png"}
                  sx={{ width: 64, height: 64, cursor: "pointer", mx: "auto" }}
                />
              </label>
            </Box>
          </Box>
          <Box
            component="nav"
            sx={{
              fontSize: 24,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 370,
              fontWeight: 500,
            }}
          >
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              мои покупки
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              избранное
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              мои карты
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              мои адреса
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              настройки уведомлений
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              FAQ/частые вопросы
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black", mt: 2 }}
            >
              служба поддержки
            </Link>
            <Box display="flex" justifyContent="flex-start" alignItems="center" sx={{mt: 2}}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ width: "50%", py: 1 }}
            >
              Выйти из аккаунта
            </Button>
            </Box>
          </Box>
        </Box>

        {/* Данные профиля*/}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mb: 4.75 }}
            gutterBottom
          >
            мой профиль
          </Typography>
          <Typography
            variant="h3"
            className="regular"
            gutterBottom
            sx={{ mb: 3.5 }}
          >
            личная информация
          </Typography>

          <Box sx={{ display: "grid", rowGap: 2.5, fontSize: 24 }}>
            <TextField
              label="Электронная почта"
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
              required
              defaultValue={user.email}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "20px", // размер текста в поле ввода
                },
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // размер текста у label
                },
              }}
            />
            <TextField
              label="Имя"
              {...register("username")}
              {...(errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              ))}
              variant="outlined"
              required
              defaultValue={user.name || "—"}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "20px", // размер текста в поле ввода
                },
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // размер текста у label
                },
              }}
            />
            <TextField
              label="Адрес"
              {...register("address")}
              {...(errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              ))}
              variant="outlined"
              required
              defaultValue={user.address || "—"}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "20px", // размер текста в поле ввода
                },
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // размер текста у label
                },
              }}
            />
            <TextField
              label="Номер телефона"
              {...register("phone")}
              {...(errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              ))}
              variant="outlined"
              required
              defaultValue={user.phone || "—"}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "20px", // размер текста в поле ввода
                },
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // размер текста у label
                },
              }}
            />
            <TextField
              label="Роль"
              variant="outlined"
              disabled
              defaultValue={user.role || "—"}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: "20px", // размер текста в поле ввода
                },
                "& .MuiInputLabel-root": {
                  fontSize: "18px", // размер текста у label
                },
              }}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <input type="checkbox" style={{ marginRight: 8 }} />
              <Typography variant="body1">
                Я даю согласие на обработку своих персональных данных в
                соответствии с Политикой обработки персональных данных
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <ColorButton
                variant="contained"
                sx={{ px: 4, py: 1, width: "50%", mb: 2 }}
              >
                Сохранить
              </ColorButton>
            </Box>
          </Box>
        </Box>

        {/* Диалог удаления */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Подтвердите удаление</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя
              отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
            >
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "flex", gap: 2 }}>
    <Typography
      sx={{
        minWidth: 180,
        fontWeight: 400,
        fontSize: 16,
        color: "#000",
      }}
    >
      {label}
    </Typography>
    <Typography sx={{ fontSize: 16, color: "#000" }}>{value}</Typography>
  </Box>
);

export default ProfilePage;
