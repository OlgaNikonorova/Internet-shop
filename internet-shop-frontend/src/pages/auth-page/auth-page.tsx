import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSchema, FormData } from "./auth-validation";
import { useAuthPage } from "./use-auth-page";
import { AuthMode } from "./auth-mode";
import { UserRole } from "../../store/models/user/user-role";

import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Box,
} from "@mui/material";

const AuthPage = () => {
  const { error, mode, onSubmit, toggleMode, setForgotPasswordMode } =
    useAuthPage();
  const isForgotPassword = mode === AuthMode.ForgotPassword;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(getSchema(mode) as any),
    defaultValues: {
      role: UserRole.USER,
    },
  });

  const selectedRole = watch("role");

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data);
  };

  const isLogin = mode === AuthMode.Login;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#ffffff"
    >
      <Paper
        elevation={5}
        sx={{ p: 4, width: "100%", maxWidth: 813, bgcolor: "white", margin: 5 }}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Typography variant="h4" textAlign="center" fontWeight={600} mb={3}>
            {isLogin
              ? "Вход"
              : isForgotPassword
              ? "Восстановление пароля"
              : "Регистрация"}
          </Typography>
          
          {isForgotPassword ? (
            <>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message?.toString()}
              />
              <TextField
                label="Логин"
                fullWidth
                margin="normal"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message?.toString()}
              />
            </>
          ) : (
            <>
              <TextField
                label="Логин"
                fullWidth
                margin="normal"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message?.toString()}
              />
              <TextField
                label="Пароль"
                type="password"
                fullWidth
                margin="normal"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message?.toString()}
              />
            </>
          )}

          {!isLogin && !isForgotPassword && (
            <>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message?.toString()}
              />

              <TextField
                label="Имя и фамилия"
                fullWidth
                margin="normal"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message?.toString()}
              />

              <TextField
                label="Адрес"
                fullWidth
                margin="normal"
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message?.toString()}
              />

              <TextField
                label="Телефон"
                fullWidth
                margin="normal"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message?.toString()}
              />

              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel id="role-label">Роль</InputLabel>
                <Select
                  labelId="role-label"
                  label="Роль"
                  value={selectedRole}
                  {...register("role")}
                  onChange={(e) => {
                    const value = e.target.value as UserRole;
                    setValue("role", value);
                  }}
                  sx={{
                    alignItems: "center",
                    ".MuiSelect-select": {
                      alignItems: "center",
                      backgroundColor: selectedRole ? "#e3f2fd" : "white",
                    },
                    "&.Mui-focused .MuiSelect-select": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                >
                  <MenuItem value={UserRole.USER} sx={{ fontSize: 20 }}>
                    Покупатель
                  </MenuItem>
                  <MenuItem value={UserRole.SELLER} sx={{ fontSize: 20 }}>
                    Продавец
                  </MenuItem>
                </Select>
                <Typography variant="caption" color="error">
                  {errors.role?.message?.toString()}
                </Typography>
              </FormControl>
            </>
          )}

          {error && (
            <Typography variant="body2" color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} marginBottom={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, fontSize: 24, width: 0.5 }}
            >
              {isLogin
                ? "Войти"
                : isForgotPassword
                ? "Восстановить пароль"
                : "Зарегистрироваться"}
            </Button>
            {isLogin && (
              <Button
                onClick={setForgotPasswordMode}
                size="medium"
                sx={{ fontSize: 16 }}
              >
                Забыли пароль?
              </Button>
            )}
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={30}
          >
            <Typography variant="h5" textAlign="center">
              {isLogin
                ? "Еще нет аккаунта?"
                : isForgotPassword
                ? "Вспомнили пароль?"
                : "Уже есть аккаунт?"}{" "}
              <Button onClick={toggleMode} size="medium" sx={{ fontSize: 20, fontWeight: "bold" }}>
                {isLogin
                  ? "Зарегистрироваться"
                  : isForgotPassword
                  ? "Войти"
                  : "Войти"}
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AuthPage;
