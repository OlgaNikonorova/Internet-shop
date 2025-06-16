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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Typography variant="h5" gutterBottom>
          Сброс пароля
        </Typography>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
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

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, fontSize: 20, fontWeight: "semibold" }}
          >
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
