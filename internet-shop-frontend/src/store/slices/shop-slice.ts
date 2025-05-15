import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ShopState = {
  pageIndex: number;
};

const initialState: ShopState = {
  pageIndex: 1,
};

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    updatePageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
  },
});

export const { updatePageIndex } = shopSlice.actions;

export const pageIndexSelector = (state: RootState) => state.shop.pageIndex;

export default shopSlice.reducer;
