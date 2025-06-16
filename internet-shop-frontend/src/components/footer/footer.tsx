import { Box, Typography, Container, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "black",
        color: "white",
        py: 8,
        px: { xs: 4, md: 8 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          fontSize: { xs: "2.5rem", md: "3rem" },
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
            color: "#C0A062",
          },
          transition: "all 0.3s ease",
        }}
        onClick={() => navigate("/")}
      >
        SOBACCINI
      </Typography>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 6,
          py: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            minWidth: { sm: "350px" },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
            }}
          >
            8 (904) 052-65-23
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              fontSize: { xs: "1.2rem", md: "1.3rem" },
            }}
          >
            Круглосуточный телефон call-центра
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.3rem", md: "1.5rem" },
            }}
          >
            О нас
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[
              "Наши магазины",
              "Вакансии",
              "Политика обработки персональных данных",
            ].map((item, index) => (
              <Box component="li" key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "#C0A062",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.3rem", md: "1.5rem" },
            }}
          >
            Контакты
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[
              "Общие контакты",
              "Отдел маркетинга и рекламы",
              "Партнерская программа",
            ].map((item, index) => (
              <Box component="li" key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "#C0A062",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      <Divider
        sx={{
          width: "100%",
          maxWidth: "lg",
          borderColor: "rgba(255,255,255,0.2)",
        }}
      />

      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          letterSpacing: 1,
          fontSize: { xs: "1rem", md: "1.1rem" },
        }}
      >
        2025 © COPYRIGHT - SOBACCINI
      </Typography>
    </Box>
  );
};

export default Footer;
