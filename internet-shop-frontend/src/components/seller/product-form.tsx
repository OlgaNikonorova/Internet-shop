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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CreateProduct from "../../store/models/product/create-product";
import {
  convertProductCategoryToRussian,
  ProductCategory,
} from "../../store/models/product/product-category";
import { useUploadFileMutation } from "../../store/api/files-api";
import { ProductStatus } from "../../store/models/product/product-status";

interface ProductFormProps {
  onSubmit: (data: CreateProduct) => void;
  isLoading?: boolean;
}

const ProductForm = ({ onSubmit, isLoading }: ProductFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProduct>({
    defaultValues: {
      stock: 0,
      images: uploadedImages,
      status: ProductStatus.ACTIVE,
    },
  });

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setUploadError(null);
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const result = await uploadFile(formData).unwrap();
        const newImageUrls = result.map((result) => result.path);

        setUploadedImages((prev) => [...prev, ...newImageUrls]);
        setValue("images", [...uploadedImages, ...newImageUrls]);
      } catch (err) {
        setUploadError("Ошибка при загрузке файлов. Попробуйте снова.");
        console.error("Upload error:", err);
      }
    },
    [uploadFile, uploadedImages, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 10,
    multiple: true,
  });

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  return (
    <Paper
      className="p-6"
      sx={{
        backgroundColor: "white",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        style={{ marginBottom: "20px", fontWeight: "bold" }}
        className="text-center font-bold"
      >
        Новый товар
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
                {Object.values(ProductCategory).map((value) => (
                  <MenuItem key={value} value={value}>
                    {convertProductCategoryToRussian(value)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>
          </Box>
          {/* <Box flex={1}>
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
                {Object.values(ProductStatus).map((value) => (
                  <MenuItem key={value} value={value}>
                    {convertProductStatusToRussian(value)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          </Box> */}
        </Box>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Фотографии товара
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              border: "1px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              borderRadius: 1,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              mb: 2,
              backgroundColor: isDragActive
                ? "action.hover"
                : "background.paper",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography>Перетащите файлы сюда...</Typography>
            ) : (
              <Typography>
                Перетащите сюда фотографии или кликните для выбора
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              (Поддерживаются JPG, PNG, WEBP. Максимум 10 файлов)
            </Typography>
          </Box>

          {uploadError && (
            <Typography
              color="error"
              variant="caption"
              display="block"
              gutterBottom
            >
              {uploadError}
            </Typography>
          )}

          {isUploading && (
            <Typography variant="caption" display="block" gutterBottom>
              Загрузка файлов...
            </Typography>
          )}

          {uploadedImages.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {uploadedImages.map((image, index) => (
                <Box
                  key={index}
                  sx={{ position: "relative", width: 100, height: 100 }}
                >
                  <img
                    src={process.env.REACT_APP_API_BASE_URL + image}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      width: "20px",
                      height: "20px",
                      right: 0,
                      color: "error.main",
                      backgroundColor: "background.paper",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "white",
                      },
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box style={{ display: "flex", justifyContent: "center" }}>
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
            {isLoading ? "Создание..." : "Создать товар"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductForm;
