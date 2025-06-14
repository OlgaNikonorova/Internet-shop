import { Box, Typography, ButtonGroup, Button } from "@mui/material";
import { Order } from "../../store/models/order";
import Product from "../../store/models/product/product";

interface SortOptionsProps {
  sortOption: {
    field: keyof Product;
    order: Order;
  };
  onSortChange: (field: keyof Product, order: Order) => void;
}

export const SortOptions = ({ sortOption, onSortChange }: SortOptionsProps) => {
  const sortFields: { field: keyof Product; label: string }[] = [
    { field: "price", label: "Цена" },
    { field: "rating", label: "Рейтинг" },
    { field: "createdAt", label: "Новинки" },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 5, height: "max-content" }}>
      <Typography variant="h6" gutterBottom>
        Сортировать по
      </Typography>
      <ButtonGroup variant="outlined" fullWidth>
        {sortFields.map(({ field, label }) => (
          <Button
            key={field}
            onClick={() =>
              onSortChange(
                field,
                sortOption.field === field &&
                  sortOption.order === Order.ASCENDING
                  ? Order.DESCENDING
                  : Order.ASCENDING
              )
            }
            color={sortOption.field === field ? "primary" : "inherit"}
          >
            {label}
            {sortOption.field === field &&
              (sortOption.order === Order.ASCENDING ? "↑" : "↓")}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};
