import {
  Box,
  Typography,
  Slider,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { ProductCategory } from "../../store/models/product/product-category";
import { convertProductCategoryToRussian } from "../../store/models/product/product-category";

interface FiltersProps {
  priceRange: [number, number];
  onPriceChange: (newRange: [number, number]) => void;
  selectedCategory?: ProductCategory;
  onCategoryToggle: (category: ProductCategory) => void;
  ratingRange: [number, number];
  onRatingChange: (newRange: [number, number]) => void;
  isPriceFilterEnabled: boolean;
  onTogglePriceFilter: (enabled: boolean) => void;
  isRatingFilterEnabled: boolean;
  onToggleRatingFilter: (enabled: boolean) => void;
}

export const Filters = ({
  priceRange,
  onPriceChange,
  selectedCategory,
  onCategoryToggle,
  ratingRange,
  onRatingChange,
  isPriceFilterEnabled,
  onTogglePriceFilter,
  isRatingFilterEnabled,
  onToggleRatingFilter,
}: FiltersProps) => {
  const categories = Object.values(ProductCategory);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    onCategoryToggle(event.target.value as ProductCategory);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 5,
        p: 3,
        backgroundColor: "background.paper",
        borderRadius: 5,
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      {/* Фильтр по цене */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Typography fontSize={20}>Цена</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isPriceFilterEnabled}
                onChange={(e) => onTogglePriceFilter(e.target.checked)}
                size="small"
              />
            }
            label={isPriceFilterEnabled ? "Вкл" : "Выкл"}
            labelPlacement="start"
            sx={{ margin: 0 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            opacity: isPriceFilterEnabled ? 1 : 0.5,
          }}
        >
          <Typography sx={{ minWidth: 60, textAlign: "right" }}>
            {priceRange[0]} ₽
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) =>
              onPriceChange(newValue as [number, number])
            }
            valueLabelDisplay="auto"
            min={0}
            max={1000000}
            step={100}
            sx={{ flex: 1 }}
            disabled={!isPriceFilterEnabled}
          />
          <Typography sx={{ minWidth: 60, textAlign: "left" }}>
            {priceRange[1]} ₽
          </Typography>
        </Box>
      </Box>

      {/* Фильтр по рейтингу */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Typography fontSize={20}>Рейтинг</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isRatingFilterEnabled}
                onChange={(e) => onToggleRatingFilter(e.target.checked)}
                size="small"
              />
            }
            label={isRatingFilterEnabled ? "Вкл" : "Выкл"}
            labelPlacement="start"
            sx={{ margin: 0 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            opacity: isRatingFilterEnabled ? 1 : 0.5,
          }}
        >
          <Typography sx={{ minWidth: 20, textAlign: "right" }}>
            {ratingRange[0]}
          </Typography>
          <Slider
            value={ratingRange}
            onChange={(_, newValue) =>
              onRatingChange(newValue as [number, number])
            }
            valueLabelDisplay="auto"
            min={0}
            max={5}
            step={0.1}
            sx={{ flex: 1 }}
            disabled={!isRatingFilterEnabled}
          />
          <Typography sx={{ minWidth: 20, textAlign: "left" }}>
            {ratingRange[1]}
          </Typography>
        </Box>
      </Box>

      {/* Фильтр по категории */}
      <FormControl sx={{ flex: 1, minWidth: 200 }}>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return "Все категории";
            }
            return convertProductCategoryToRussian(selected as ProductCategory);
          }}
        >
          <MenuItem value={undefined}>Все категории</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {convertProductCategoryToRussian(category)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
