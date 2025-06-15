import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type FavoritesState = {
  lastUpdated: number;
};

const initialState: FavoritesState = {
  lastUpdated: Date.now(),
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    refreshFavorites(state) {
      state.lastUpdated = Date.now();
    },
  },
});

export const { refreshFavorites } = favoritesSlice.actions;

export const lastUpdatedSelector = (state: RootState) =>
  state.favorites.lastUpdated;

export default favoritesSlice.reducer;
