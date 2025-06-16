import {
  Container,
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Link,
  TextField,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { useProfilePage } from "./use-profile-page";
import { Edit } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const ProfilePage = () => {
  const {
    user,
    form,
    isLoading,
    error,
    handleUpdateProfile,
    handleAvatarChange,
    handleLogout,
    isPasswordEditable,
    setIsPasswordEditable,
  } = useProfilePage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Ошибка загрузки данных пользователя
      </Alert>
    );

  if (!user)
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Пользователь не найден
      </Alert>
    );

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
              {user.phone ?? user.name}
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
                <Box
                  sx={{
                    position: "relative",
                  }}
                >
                  <Avatar
                    src={
                      (user.avatar &&
                        process.env.REACT_APP_API_BASE_URL + user.avatar) ||
                      "/default-avatar.png"
                    }
                    sx={{
                      width: 64,
                      height: 64,
                      cursor: "pointer",
                      mx: "auto",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      right: -5,
                      bottom: -5,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <BorderColorIcon sx={{ fontSize: 25 }} />
                  </Box>
                </Box>
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
              Мои покупки
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              Избранное
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              Мои карты
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              Мои адреса
            </Link>
            <Link
              component={RouterLink}
              to="/orders"
              underline="none"
              sx={{ color: "black" }}
            >
              Настройки уведомлений
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
              Служба поддержки
            </Link>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 2 }}
            >
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
            Мой профиль
          </Typography>
          <Typography
            variant="h3"
            className="regular"
            gutterBottom
            sx={{ mb: 3.5 }}
          >
            Личная информация
          </Typography>

          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <Box sx={{ display: "grid", rowGap: 2.5, fontSize: 24 }}>
              <TextField
                label="Email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message?.toString()}
              />

              <TextField
                label="Логин"
                fullWidth
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message?.toString()}
              />

              <TextField
                label="Имя и фамилия"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message?.toString()}
              />

              <TextField
                label="Адрес"
                fullWidth
                {...register("address")}
                {...(errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                ))}
              />
              <TextField
                fullWidth
                label="Номер телефона"
                {...register("phone")}
                {...(errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                ))}
                defaultValue={user.phone}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  label="Пароль"
                  type="password"
                  fullWidth
                  disabled={!isPasswordEditable}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message?.toString()}
                  required={false}
                  value={isPasswordEditable ? undefined : "**********"}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
                <IconButton
                  onClick={() => {
                    setIsPasswordEditable(!isPasswordEditable);
                    if (isPasswordEditable) {
                      setValue("password", undefined);
                    } else {
                      setValue("password", "");
                    }
                  }}
                  color={isPasswordEditable ? "primary" : "default"}
                >
                  {isPasswordEditable ? <CloseIcon /> : <Edit />}
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ px: 4, py: 1, width: "50%", mb: 2 }}
                >
                  Сохранить
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
