import { useCreateProductMutation } from '../../store/api/products-api';

import { useNavigate } from 'react-router-dom';

import { Box, Typography, Container, Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

import ProductForm from '../../components/seller/productForm';
import CreateProduct from '../../store/models/product/create-product';
import { ProductStatus } from '../../store/models/product/product-status';

const CreateProductPage = () => {
  const [createProduct] = useCreateProductMutation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (productData: CreateProduct) => {
    try {
      await createProduct({
        ...productData,
        images: productData.images || [] // Гарантируем массив
      }).unwrap();

      setSuccessMessage('Product created successfully!');
      setTimeout(() => navigate('/seller/products'), 1500);
    } catch (err) {
      console.error('Failed to create product:', err);
      setError('Failed to create product. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Create New Product
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Box className="bg-white p-6 rounded-lg shadow-md">
        <ProductForm 
          onSubmit={handleSubmit}
          initialValues={{
            name: '',
            description: '',
            price: 0,
            category: '',
            status: ProductStatus.ACTIVE,
            stock: 0,
            images: []
          }}
        />
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Container>
  );
};

export default CreateProductPage;