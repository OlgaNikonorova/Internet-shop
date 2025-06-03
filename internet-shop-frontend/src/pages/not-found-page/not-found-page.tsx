import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8"
    >
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            background: 'linear-gradient(0deg,rgb(86, 86, 86),rgb(35, 35, 35))',
            backdropFilter: "blur(10px)",
            color: "#fff",
            mb: 0,
          }}
          className="mb-8"
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            404 NOT FOUND
          </Typography>
          <Typography variant="body1" gutterBottom>
            Такая страница не существует
          </Typography>
          <Typography variant="body2" color="#cccccc" gutterBottom>
            Мы пока не знаем в чем ошибка, но скоро всё исправим
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              background: 'linear-gradient(0deg,rgb(92, 92, 92),rgb(35, 35, 35))',
              "&:hover": {
                backgroundColor: "#555",
              },
            }}
            component={Link}
            to="/"
          >
            В главное меню
          </Button>
        </Paper>

        {/* Картинка на половину высоты экрана */}
        <Box className="w-full flex justify-center mt-0">
          <img
            src="/images/cat-404.webp"
            alt="Черный кот в капюшоне"
            className="w-[85vw] h-[60vh] object-cover rounded-xl mt-0"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
