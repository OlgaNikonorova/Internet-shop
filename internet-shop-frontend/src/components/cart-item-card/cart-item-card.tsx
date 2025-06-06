import CartItem from "../../store/models/cart/cart-item";

interface CartItemCardProps {
  cartItem: CartItem;
  onIncrease: (cartItemId: string, quantity?: number) => void;
  onDecrease: (cartItemId: string, quantity?: number) => void;
  onDelete: (cartItemId: string) => void;
}

const CartItemCard = (props: CartItemCardProps) => {
  const { cartItem, onDecrease, onIncrease, onDelete } = props;

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

      <div className="absolute top-2 right-2 flex items-center space-x-2 bg-gray-100 rounded-md px-2 py-1 text-sm">
        <button
          onClick={() => onDecrease(cartItem.id, cartItem.quantity)}
          className="w-6 h-6 flex justify-center items-center rounded bg-gray-200 hover:bg-gray-300 border-none"
        >
          −
        </button>
        <span className="min-w-[20px] text-center">{cartItem.quantity}</span>
        <button
          onClick={() => onIncrease(cartItem.id, cartItem.quantity)}
          className="w-6 h-6 flex justify-center items-center rounded bg-gray-200 hover:bg-gray-300 border-none"
        >
          +
        </button>
      </div>

      <button
        className="bg-black h-1/2 p-2 text-white mt-2 rounded "
        onClick={() => onDelete(cartItem.id)}
      >
        Удалить
      </button>
    </div>
  );
};

export default CartItemCard;
