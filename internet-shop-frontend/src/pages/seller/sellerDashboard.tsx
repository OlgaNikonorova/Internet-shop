import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import ProductStats from "./productsStats";
import RecentProducts from "./recentProducts";


const SellerDashboard = () => {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Seller Dashboard
      </Typography>
      
      <Grid container spacing={3} className="mb-6">
        <Grid container className="flex justify-between">
          <Button 
            variant="contained" 
            component={Link} 
            to="/seller/products/create"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            Add New Product
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/seller/products"
            className="border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            View All Products
          </Button>
        </Grid>
      </Grid>
      
      <Card className="mb-6 shadow-md">
        <CardContent>
          <ProductStats />
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardContent>
          <RecentProducts />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SellerDashboard;