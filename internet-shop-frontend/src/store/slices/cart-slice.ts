import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CartState = {
  itemsCount: number;
  productIds: string[];
};

const initialState: CartState = {
  itemsCount: 0,
  productIds: [],
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

    addCartProductId: (state, action: PayloadAction<string>) => {
      state.productIds.push(action.payload);
    },

    setCartProductIds: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
  },
});

export const {
  addCartItem,
  setCartItemsCount,
  addCartProductId,
  setCartProductIds
} = cartSlice.actions;

export const cartItemsCountSelector = (state: RootState) =>
  state.cart.itemsCount;

export const cartProductIdsSelector = (state: RootState) =>
  state.cart.productIds;

export default cartSlice.reducer;
