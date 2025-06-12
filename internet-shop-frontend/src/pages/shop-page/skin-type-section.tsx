import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Box, Typography } from '@mui/material';

export const SkinTypeSection = () => {
  return (
    <Box className="w-full flex flex-col lg:flex-row items-center gap-8 py-12 px-10 bg-black text-white">
      <img
        src={process.env.REACT_APP_API_BASE_URL + "/uploads/files-1749755706117-717195198.jpeg"}
        alt="skin test"
        className="w-[600px] h-[562px] rounded-lg shadow-lg object-cover"
      />
      <Box className="flex-1 flex flex-col gap-4">
        <Typography variant="body2" className="uppercase tracking-wide">
          ПУСТЬ КОЖА СИЯЕТ ИЗНУТРИ
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          ПРОЙДИ ТЕСТ НА ТИП КОЖИ И УЗНАЙ ПОДХОДЯЩИЙ ТЕБЕ УХОД
        </Typography>

        <Accordion sx={{ backgroundColor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h5" sx={{fontWeight: 500}}>СУХАЯ КОЖА</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">
                Ссылка на тест:{" "}
                <a
                    href="https://ru.wikihow.com/какой-у-меня-тип-кожи-test"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#979797", textDecoration: "underline" }}
                >
                    https://ru.wikihow.com/какой-у-меня-тип-кожи-test
                </a>
                <br />
                <br />
  Твоя кожа часто шелушится, склонна к покраснениям и ты часто ощущаешь чувство стянутости? Ты обладатель сухой кожи!  
  <br />
  <strong>Рекомендуемый уход:</strong> Мягкие молочко или крем-гели без SLS, кремы с гиалуроновой кислотой, церамидами, маслами (ши, жожоба), скваланом, аллантоином, SPF 30+ (даже зимой!)  
  <br />
  <strong>Избегать:</strong> Спирта в тониках, агрессивных скрабов, щелочного мыла
                </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ backgroundColor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h5" sx={{fontWeight: 500}}>ЖИРНАЯ КОЖА</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">
                Ссылка на тест:{" "}
                <a
                    href="https://ru.wikihow.com/какой-у-меня-тип-кожи-test"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#979797", textDecoration: "underline" }}
                >
                    https://ru.wikihow.com/какой-у-меня-тип-кожи-test
                </a>
                <br />
                <br />
  Твоя кожа быстро начинает блестеть, часто появляются прыщи и расширенные поры? У тебя жирная кожа!  
  <br />
  <strong>Рекомендуемый уход:</strong> Гели или пенки с салициловой кислотой, цинком, ниацинамидом (до 10%), ретинолом (в небольших дозах), лёгкие кремы или гелевые флюиды, матирующий SPF 30+  
  <br />
  <strong>Избегать:</strong> Минеральных и кокосовых масел, ланолина, плотных текстур и комедогенных компонентов
                </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ backgroundColor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h5" sx={{fontWeight: 500}}>КОМБИНИРОВАННАЯ КОЖА</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">
                Ссылка на тест:{" "}
                <a
                    href="https://ru.wikihow.com/какой-у-меня-тип-кожи-test"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#979797", textDecoration: "underline" }}
                >
                    https://ru.wikihow.com/какой-у-меня-тип-кожи-test
                </a>
                <br />
                <br />
  Лоб, нос и подбородок блестят, а щёки — нормальные или сухие? У тебя комбинированная кожа!  
  <br />
  <strong>Рекомендуемый уход:</strong> Нежные гели с зелёным чаем или центеллой, увлажняющий тонер с гиалуроновой кислотой, ниацинамидом (до 5%), лёгкие кремы без масел, точечные средства с цинком или BHA для Т-зоны, SPF 30+  
  <br />
  <strong>Избегать:</strong> Жирных универсальных кремов, спиртосодержащих лосьонов, абразивных скрабов
                </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ backgroundColor: 'transparent', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h5" sx={{fontWeight: 500}}>НОРМАЛЬНАЯ КОЖА</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" >
                Ссылка на тест:{" "}
                <a
                    href="https://ru.wikihow.com/какой-у-меня-тип-кожи-test"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#979797", textDecoration: "underline" }}
                >
                    https://ru.wikihow.com/какой-у-меня-тип-кожи-test
                </a>
                <br />
                <br />
  Кожа ровная, без покраснений и жирного блеска? Не шелушится и не вызывает дискомфорта? Поздравляем, у тебя нормальная кожа!  
  <br />
  <strong>Рекомендуемый уход:</strong> Лёгкие пенки или гели, кремы с пантенолом, ниацинамидом, алоэ вера, витамином Е, базовое увлажнение, регулярный SPF 30+  
  <br />
  <strong>Избегать:</strong> Жёстких очищающих средств, частого использования кислот и сильных активов без показаний
                </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};
