import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CartState = {
  itemsCount: number;
};

const initialState: CartState = {
  itemsCount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem: (state, action: PayloadAction<number>) => {
      state.itemsCount += action.payload;
    },

    setCartItemsCount: (state, action: PayloadAction<number>) => {
      state.itemsCount = action.payload;
    },
  },
});

export const { addCartItem, setCartItemsCount } = cartSlice.actions;

export const cartItemsCountSelector = (state: RootState) =>
  state.cart.itemsCount;

export default cartSlice.reducer;
