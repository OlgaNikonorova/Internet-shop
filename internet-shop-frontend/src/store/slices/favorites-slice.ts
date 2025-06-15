import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type FavoritesState = {
  lastUpdatedFavorites: number;
};

const initialState: FavoritesState = {
  lastUpdatedFavorites: Date.now(),
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    refreshFavorites(state) {
      state.lastUpdatedFavorites = Date.now();
    },
  },
});

export const { refreshFavorites } = favoritesSlice.actions;

export const lastUpdatedFavoritesSelector = (state: RootState) =>
  state.favorites.lastUpdatedFavorites;

export default favoritesSlice.reducer;
