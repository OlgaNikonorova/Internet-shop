import { Box, Typography, Grid, Paper } from "@mui/material";
import { TrendingUp, ShoppingCart, DollarSign } from "react-feather";

const ProductStats = () => {
  const stats = [
    { title: "Total Products", value: 24, icon: <ShoppingCart className="text-blue-500" /> },
    { title: "Active Listings", value: 18, icon: <TrendingUp className="text-green-500" /> },
    { title: "Monthly Revenue", value: "$3,845", icon: <DollarSign className="text-purple-500" /> }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid container key={index}>
          <Paper className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Box className="flex justify-between items-center">
              <div>
                <Typography variant="subtitle2" className="text-gray-500">
                  {stat.title}
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {stat.value}
                </Typography>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                {stat.icon}
              </div>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductStats;