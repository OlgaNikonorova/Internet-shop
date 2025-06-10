import { Box, Typography, Button } from '@mui/material'; // убедитесь, что это MUI Grid
import { Link } from 'react-router-dom';
import ProductCard from '../product-card/product-card';
import Product from '../../store/models/product/product';
import Grid from '@mui/material/Grid';

interface CategorySectionProps {
  title: string;
  products: Product[];
  viewAllLink: string;
  layout?: 'vertical' | 'horizontal';
  highlightDiscount?: boolean;
}

const CategorySection = ({
  title,
  products,
  viewAllLink,
  layout = 'vertical',
  highlightDiscount = false,
}: CategorySectionProps) => {
  if (!products.length) return null;

  return (
    <Box component="section" className="w-full mb-12">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" component="h2" className="font-bold">
          {title}
        </Typography>
        <Button
          component={Link}
          to={viewAllLink}
          className="text-pink-500 hover:text-pink-600"
          endIcon={<span>→</span>}
        >
          Посмотреть все
        </Button>
      </Box>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid container component="div">
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
