import { useCreateProductMutation } from "../../store/api/products-api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import ProductForm from "../../components/seller/product-form";
import CreateProduct from "../../store/models/product/create-product";
import { ProductStatus } from "../../store/models/product/product-status";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CheckCircle } from "@mui/icons-material";

const CreateProductPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [createProduct] = useCreateProductMutation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.user);

  const refreshForm = () => {
    setFormKey((prevKey) => prevKey + 1);
  };

  const handleSubmit = async (productData: CreateProduct) => {
    try {
      // Валидация перед отправкой
      if (
        !productData.name ||
        !productData.description ||
        productData.price <= 0
      ) {
        throw new Error("Please fill all required fields");
      }

      const jsonData = JSON.stringify({
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category || "decorative cosmetics",
        status: productData.status || ProductStatus.Активный,
        stock: Number(productData.stock) || 0,
        images: productData.images || [],
      });

      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: jsonData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

      setSuccessModalOpen(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    navigate("/shop");
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Box className="mb-6" sx = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Typography
          variant="h4"
          component="h1"
          className="font-bold"
          color="white"
        >
          Создать товар
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Box className="bg-white p-6 rounded-lg shadow-md">
        <ProductForm
          key={formKey}
          onSubmit={handleSubmit}
          initialValues={{
            name: "",
            description: "",
            price: 0,
            category: "",
            status: ProductStatus.Активный,
            stock: 0,
            images: [],
          }}
        />
      </Box>

      {/* Модальное окно успешного добавления товара */}
      <Dialog
        open={successModalOpen}
        onClose={handleCloseSuccessModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ textAlign: "center", p: 3 }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />

          <DialogTitle
            id="alert-dialog-title"
            sx={{
              color: "green",
              textAlign: "center",
              fontSize: "2rem",
            }}
          >
            Успешно!
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{ textAlign: "center", fontSize: "2rem" }}
            >
              Товар был успешно добавлен в каталог.
            </DialogContentText>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
              pt: 3,
            }}
          >
            <Button
              onClick={handleCloseSuccessModal}
              variant="contained"
              color="success"
              sx={{ px: 4 }}
            >
              В главное меню
            </Button>
            <Button
              onClick={() => {
                setSuccessModalOpen(false);
                refreshForm();
              }}
              variant="outlined"
              sx={{ px: 4 }}
            >
              Добавить еще
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default CreateProductPage;
