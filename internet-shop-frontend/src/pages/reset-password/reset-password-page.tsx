import { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useTypedSelector } from "../../store/hooks";
import { resetTokenSelector } from "../../store/slices/user-slice";
import { useResetPasswordMutation } from "../../store/api/auth-api";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const resetToken = useTypedSelector(resetTokenSelector) ?? "";
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Пароли не совпадают");
      return;
    }

    try {
      await resetPassword({
        resetToken,
        password: newPassword,
      }).unwrap();
      setMessage("Пароль успешно изменен!");
      navigate("/auth");
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage("Ошибка при сбросе пароля");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Сброс пароля
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Новый пароль"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <TextField
            label="Подтвердите пароль"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Сбросить пароль
          </Button>
        </form>

        {message && (
          <Typography
            color={message.includes("успешно") ? "success.main" : "error"}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
