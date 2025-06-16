import DeleteIcon from "@mui/icons-material/Delete";
import CartItem from "../../store/models/cart/cart-item";
import Counter from "../counter/counter";
import {
  useRemoveItemFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "../../store/api/cart-api";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../store/slices/cart-slice";
import { useNavigate } from "react-router-dom";

interface CartItemCardProps {
  cartItem: CartItem;
  refetchCart: () => void;
  onNavigateProduct: () => void;
}

const CartItemCard = (props: CartItemCardProps) => {
  const { cartItem, refetchCart, onNavigateProduct } = props;

  const navigate = useNavigate();

  const mainImage =
    (cartItem.productImages &&
      cartItem.productImages.length > 0 &&
      process.env.REACT_APP_API_BASE_URL + cartItem.productImages[0]) ||
    "/images/placeholder.webp";
  const productName = cartItem.productName;
  const productPrice = cartItem.productPrice || 0;
  const quantity = cartItem.quantity || 1;

  const [updateQuantity] = useUpdateCartItemQuantityMutation();

  const [deleteCartItem] = useRemoveItemFromCartMutation();
  const dispatch = useDispatch();

  const handleOnIncrease = () => {
    onIncrease(cartItem.id, quantity);
  };

  const handleOnDecrease = () => {
    onDecrease(cartItem.id, quantity);
  };

  const onDecrease = async (cartItemId: string, quantity: number) => {
    if (quantity > 1) {
      await updateQuantity({
        cartItemId: cartItemId,
        updateCartItem: { quantity: quantity - 1 },
      });
    } else {
      await deleteCartItem(cartItemId);
      dispatch(addCartItem(-1));
    }
    refetchCart();
  };

  const onIncrease = async (cartItemId: string, quantity: number) => {
    await updateQuantity({
      cartItemId: cartItemId,
      updateCartItem: { quantity: quantity + 1 },
    });
    refetchCart();
  };

  const onDelete = async (cartItemId: string) => {
    await deleteCartItem(cartItemId);
    dispatch(addCartItem(-1));
    refetchCart();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:justify-between items-center">
      <div className="w-full md:w-1/4">
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-auto object-cover rounded cursor-pointer"
          onClick={() => {
            navigate(`/product/${cartItem.productId}`);
            onNavigateProduct();
          }}
        />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-2 self-end">
          <button className="h-1/2 w-fit" onClick={() => onDelete(cartItem.id)}>
            <DeleteIcon />
          </button>

          <Counter
            count={quantity}
            onIncrease={handleOnIncrease}
            onDecrease={handleOnDecrease}
          />
        </div>

        <h3 className="text-lg font-medium self-center">{productName}</h3>
        <p className="text-lg font-bold self-end">
          {(productPrice * quantity).toFixed(2)} ₽
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;
