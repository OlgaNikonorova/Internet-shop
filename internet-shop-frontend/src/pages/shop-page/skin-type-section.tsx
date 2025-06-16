import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Box, Typography, Button } from "@mui/material";

export const SkinTypeSection = () => {
  const elegantGold = "#C0A062";
  const darkGold = "#A08650";
  const lightText = "#F5F5F5";
  const darkText = "#333333";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: "center",
        gap: 6,
        py: 8,
        px: { xs: 4, md: 8 },
        backgroundColor: "black",
        color: lightText,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", lg: "600px" },
          height: { xs: "400px", lg: "562px" },
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          position: "relative",
          flexShrink: 0,
          "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.03)",
            },
          },
        }}
      >
        <img
          src={
            process.env.REACT_APP_API_BASE_URL +
            "/uploads/files-1749755706117-717195198.jpeg"
          }
          alt="skin test"
        />
      </Box>

      {/* Контент */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxWidth: "800px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            letterSpacing: 2,
            color: elegantGold,
            fontSize: "1rem",
          }}
        >
          ПУСТЬ КОЖА СИЯЕТ ИЗНУТРИ
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            lineHeight: 1.3,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
          }}
        >
          ПРОЙДИ ТЕСТ НА ТИП КОЖИ И УЗНАЙ ПОДХОДЯЩИЙ ТЕБЕ УХОД
        </Typography>

        {/* Раскрывающиеся панели */}
        {[
          {
            title: "СУХАЯ КОЖА",
            description:
              "Твоя кожа часто шелушится, склонна к покраснениям и ты часто ощущаешь чувство стянутости? Ты обладатель сухой кожи!",
            care: "Мягкие молочко или крем-гели без SLS, кремы с гиалуроновой кислотой, церамидами, маслами (ши, жожоба), скваланом, аллантоином, SPF 30+ (даже зимой!)",
            avoid: "Спирта в тониках, агрессивных скрабов, щелочного мыла",
          },
          {
            title: "ЖИРНАЯ КОЖА",
            description:
              "Твоя кожа быстро начинает блестеть, часто появляются прыщи и расширенные поры? У тебя жирная кожа!",
            care: "Гели или пенки с салициловой кислотой, цинком, ниацинамидом (до 10%), ретинолом (в небольших дозах), лёгкие кремы или гелевые флюиды, матирующий SPF 30+",
            avoid:
              "Минеральных и кокосовых масел, ланолина, плотных текстур и комедогенных компонентов",
          },
          {
            title: "КОМБИНИРОВАННАЯ КОЖА",
            description:
              "Лоб, нос и подбородок блестят, а щёки — нормальные или сухие? У тебя комбинированная кожа!",
            care: "Нежные гели с зелёным чаем или центеллой, увлажняющий тонер с гиалуроновой кислотой, ниацинамидом (до 5%), лёгкие кремы без масел, точечные средства с цинком или BHA для Т-зоны, SPF 30+",
            avoid:
              "Жирных универсальных кремов, спиртосодержащих лосьонов, абразивных скрабов",
          },
          {
            title: "НОРМАЛЬНАЯ КОЖА",
            description:
              "Кожа ровная, без покраснений и жирного блеска? Не шелушится и не вызывает дискомфорта? Поздравляем, у тебя нормальная кожа!",
            care: "Лёгкие пенки или гели, кремы с пантенолом, ниацинамидом, алоэ вера, витамином Е, базовое увлажнение, регулярный SPF 30+",
            avoid:
              "Жёстких очищающих средств, частого использования кислот и сильных активов без показаний",
          },
        ].map((item, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: "rgba(255,255,255,0.05)",
              color: lightText,
              boxShadow: "none",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                margin: 0,
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: elegantGold }} />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 2,
                },
                "&.Mui-expanded": {
                  minHeight: "64px",
                },
              }}
            >
              <Box
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: elegantGold,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  fontSize: "1.3rem",
                }}
              >
                {item.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {item.description}
              </Typography>

              <Box
                sx={{
                  backgroundColor: "rgba(192, 160, 98, 0.1)",
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: elegantGold,
                    mb: 1,
                  }}
                >
                  Рекомендуемый уход:
                </Typography>
                <Typography variant="h6">{item.care}</Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Избегать:
                </Typography>
                <Typography variant="h6">{item.avoid}</Typography>
              </Box>

              <Button
                href="https://ru.wikihow.com/какой-у-меня-тип-кожи-test"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 2,
                  color: elegantGold,
                  textDecoration: "underline",
                  "&:hover": {
                    color: darkGold,
                  },
                }}
              >
                Пройти тест
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};
