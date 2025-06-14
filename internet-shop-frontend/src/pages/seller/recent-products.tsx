import { Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import Product from "../../store/models/product/product";

const RecentProducts = () => {

  const recentProducts: Product[] = [
   
  ];

  return (
    <div>
      <Typography variant="h6" className="mb-4 font-semibold">
        Recent Products
      </Typography>
      <List className="divide-y divide-gray-200">
        {recentProducts.map((product) => (
          <ListItem key={product.id} className="py-4 hover:bg-gray-50">
            <ListItemAvatar>
              <Avatar src={product.images?.[0]} />
            </ListItemAvatar>
            <ListItemText
              primary={product.name}
              secondary={`$${product.price?.toFixed(2)} • ${product.category}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default RecentProducts;