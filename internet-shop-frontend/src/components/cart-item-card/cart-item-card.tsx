import CartItem from "../../store/models/cart/cart-item";

interface CartItemCardProps {
  cartItem: CartItem;
}

const CartItemCard = (props: CartItemCardProps) => {
  const { cartItem } = props;

  const mainImage = cartItem.productImages?.[0] || "/placeholder-product.jpg";
  const productName = cartItem.productName || "Unnamed Product";
  const productPrice = cartItem.productPrice || 0;
  const quantity = cartItem.quantity || 1;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg shadow-sm">
      <div className="w-full md:w-1/4">
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-auto object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-medium">{productName}</h3>
        <p className="text-gray-600">${productPrice.toFixed(2)}</p>
        <p className="text-gray-500">Quantity: {quantity}</p>
        <p className="text-gray-500">
          Total: ${(productPrice * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
