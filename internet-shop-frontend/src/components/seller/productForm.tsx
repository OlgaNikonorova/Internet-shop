import { useForm } from "react-hook-form";
import { TextField, Button, Box, Grid, Typography, Paper } from "@mui/material";
import Product from "../../store/models/product/product";



interface ProductFormProps {
  onSubmit: (data: Product) => void;
  initialValues?: Partial<Product>;
}

const ProductForm = ({ onSubmit, initialValues }: ProductFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    defaultValues: initialValues
  });

  return (
    <Paper className="p-6 shadow-lg">
      <Typography variant="h5" className="mb-6 text-center font-bold">
        {initialValues ? "Edit Product" : "Create New Product"}
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-2xl mx-auto"
      >
        <Grid container spacing={3}>
          <Grid container>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              className="bg-white rounded-lg"
              {...register("name", { required: "Product name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          
          <Grid container>
            <TextField
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              className="bg-white rounded-lg"
              {...register("price", { 
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" }
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Grid>
          
          <Grid container>
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              className="bg-white rounded-lg"
              {...register("category", { required: "Category is required" })}
              error={!!errors.category}
              helperText={errors.category?.message}
            />
          </Grid>
          
          <Grid container>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              className="bg-white rounded-lg"
              {...register("description")}
            />
          </Grid>
          
          <Grid container>
            <TextField
              fullWidth
              label="Image URL"
              variant="outlined"
              className="bg-white rounded-lg"
              {...register("images.0")}
              placeholder="https://example.com/product.jpg"
            />
          </Grid>
          
          <Grid container className="flex justify-end">
            <Button 
              type="submit" 
              variant="contained" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg shadow-md transition-colors"
            >
              {initialValues ? "Update Product" : "Create Product"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ProductForm;