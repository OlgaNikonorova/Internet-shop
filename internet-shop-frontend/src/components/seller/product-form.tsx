import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from "@mui/material";
import { ProductStatus } from "../../store/models/product/product-status";
import CreateProduct from "../../store/models/product/create-product";
import { ProductCategory } from "../../store/models/product/product-category";

interface ProductFormProps {
  onSubmit: (data: CreateProduct) => void;
  initialValues?: Partial<CreateProduct>;
  isLoading?: boolean;
}

const ProductForm = ({
  onSubmit,
  initialValues,
  isLoading,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProduct>({
    defaultValues: {
      status: ProductStatus.Активный,
      stock: 0,
      images: [],
      ...initialValues,
    },
  });

  return (
    <Paper
      className="p-6"
      sx={{
        backgroundColor: "white",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" className="mb-6 text-center font-bold">
        {initialValues ? "Новый товар" : "Редактировать товар"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto backround-white"
      >
        <Box mb={3}>
          <TextField
            fullWidth
            label="Название товара"
            variant="outlined"
            {...register("name", {
              required: "Добавьте цназвание товара",
              minLength: { value: 3, message: "Минимум 3 символа" },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label="Описание"
            variant="outlined"
            multiline
            rows={4}
            {...register("description", {
              required: "Добавьте описание товара",
              minLength: { value: 10, message: "Минимум 10 символов" },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Цена, ₽"
              type="number"
              variant="outlined"
              inputProps={{ step: "0.01", min: "0.01" }}
              {...register("price", {
                required: "Добавьте цену товара",
                min: { value: 0.01, message: "Цена должна быть больше 0" },
                valueAsNumber: true,
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Box>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Количество в продаже"
              type="number"
              variant="outlined"
              inputProps={{ min: "0" }}
              {...register("stock", {
                required: "Добавьте количество товара в продаже",
                min: {
                  value: 0,
                  message: "Количество товара должно быть больше или равно 0",
                },
                valueAsNumber: true,
              })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />
          </Box>
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <Box flex={1}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Категория</InputLabel>
              <Select
                label="Категория"
                {...register("category", {
                  required: "Добавьте категорию товара",
                  validate: (value: string) =>
                    Object.values(ProductCategory).includes(
                      value as ProductCategory
                    ) || "Invalid category",
                })}
              >
                {Object.entries(ProductStatus).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>
          </Box>
          <Box flex={1}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Статус товара</InputLabel>
              <Select
                label="Статус товара"
                {...register("status", {
                  required: "Добавьте статус товара",
                  validate: (value) =>
                    Object.values(ProductStatus).includes(value) ||
                    "Invalid status",
                })}
              >
                {Object.values(ProductStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Box>
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
                px: 6,
                py: 2,
              }}
            >
              {isLoading
                ? "Создание..."
                : initialValues
                ? "Создать товар"
                : "Сохранить изменения"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductForm;
