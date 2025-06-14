import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Typography,
  Avatar
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";
import Product from "../../store/models/product/product";

interface ProductListProps {
  products: Product[];
  onDelete?: (id: string) => void;
}

const ProductList = ({ products, onDelete }: ProductListProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table className="min-w-full">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold">Product</TableCell>
              <TableCell className="font-bold" align="right">Price</TableCell>
              <TableCell className="font-bold">Category</TableCell>
              <TableCell className="font-bold" align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      src={product.images?.[0]} 
                      className="w-10 h-10"
                    />
                    <Typography className="font-medium">
                      {product.name}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="right" className="font-medium">
                  ${product.price?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-center space-x-1">
                    <IconButton
                      component={Link}
                      to={`/seller/products/edit/${product.id}`}
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete?.(product.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {products.length === 0 && (
        <div className="text-center py-8">
          <Typography variant="h6" className="text-gray-500">
            No products found
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ProductList;