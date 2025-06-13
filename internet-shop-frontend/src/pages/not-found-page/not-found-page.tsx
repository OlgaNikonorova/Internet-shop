import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8"
    sx = {{background: `linear-gradient(to right, rgba(0, 0, 0, 0.9), transparent 70%, transparent 70%, rgba(0, 0, 0, 0.9))`,}}

    >
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            fontSize: 30,
            background: 'linear-gradient(0deg,rgb(55, 54, 54),rgb(31, 30, 30))',
            backdropFilter: "blur(10px)",
            color: "#fff",
            mb: 0,
          }}
          className="mb-8"
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            404 NOT FOUND
          </Typography>
          <Typography variant="h4" gutterBottom>
            Такая страница не существует
          </Typography>
          <Typography variant="h4" color="#cccccc" gutterBottom>
            Мы пока не знаем в чем ошибка, но скоро всё исправим
          </Typography>

      <Link to="/shop">
          <Button
            variant="contained"
            sx={{
              mt: 2,
              fontSize: 30, 
            }}
          >
            В главное меню
          </Button>
          </Link>
        </Paper>

        <Box className="w-full flex justify-center mt-0">
          <img
            src="/images/cat-404.webp"
            alt="Черный кот в капюшоне"
            className="w-[75vw] h-[58vh] object-cover rounded-xl mt-0"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
