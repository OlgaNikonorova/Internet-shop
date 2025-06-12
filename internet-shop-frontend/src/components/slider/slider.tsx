import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { ReactNode, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

interface SliderProps {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  bgImagePath?: string;
}

const Slider = (props: SliderProps) => {
  const swiperRef = useRef<{ swiper: SwiperType } | null>(null);

  const { title, items, renderItem, bgImagePath } = props;

  return (
    <>
      <Typography
        variant="h4"
        sx={{ marginTop: "10vh" }}
        className="text-white"
      >
        {title}
      </Typography>
      {bgImagePath && (
        <Box
          className="w-900"
          sx={{
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              pointerEvents: "none",
              background: `
                linear-gradient(to right, rgba(0,0,0,1) 0%, transparent 10%, transparent 90%, rgba(0,0,0,1) 100%),
                linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,1) 100%)
              `,
            },
          }}
        >
          <img
            src={bgImagePath}
            alt="Изображение для секции"
            className="w-full h-auto rounded-lg"
            style={{ display: 'block' }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex" }} className="w-full">
        <Button
          onClick={() => swiperRef.current?.swiper.slidePrev()}
          color="secondary"
        >
          <ChevronLeft fontSize="large" />
        </Button>

        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          ref={swiperRef}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="px-2"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>{renderItem(item, index)}</SwiperSlide>
          ))}
        </Swiper>

        <Button
          onClick={() => swiperRef.current?.swiper.slideNext()}
          color="secondary"
        >
          <ChevronRight fontSize="large" />
        </Button>
      </Box>
    </>
  );
};

export default Slider;
