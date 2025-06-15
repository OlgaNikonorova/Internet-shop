import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import { authApi } from "./api/auth-api";
import { userSlice } from "./slices/user-slice";
import { productsApi } from "./api/products-api";
import { reviewsApi } from "./api/reviews-api";
import { userApi } from "./api/user-api";
import { cartApi } from "./api/cart-api";
import { favoritesApi } from "./api/favorites-api";
import { cartSlice } from "./slices/cart-slice";
import { filesApi } from "./api/files-api";
import { favoritesSlice } from "./slices/favorites-slice";

const authApiPersistConfig = {
  key: "authApi",
  storage: storage,
};

const productsApiPersistConfig = {
  key: "productsApi",
  storage: storage,
};

const cartApiPersistConfig = {
  key: "cartApi",
  storage: storage,
};

const reviewsApiPersistConfig = {
  key: "reviewsApi",
  storage: storage,
};

const favoritesApiPersistConfig = {
  key: "favoritesApi",
  storage: storage,
};

const userApiPersistConfig = {
  key: "userApi",
  storage: storage,
};

const filesApiPersistConfig = {
  key: "filesApi",
  storage: storage,
};

const userPersistConfig = {
  key: "user",
  storage: storage,
  whiteList: ["accessToken", "refreshToken", "username", "avatar", "role"],
};

const cartPersistConfig = {
  key: "cart",
  storage: storage,
  whiteList: ["itemsCount", "productIds"],
};

const favoritesPersistConfig = {
  key: "favorites",
  storage: storage,
  whiteList: ["lastUpdated"],
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: persistReducer(authApiPersistConfig, authApi.reducer),
  [productsApi.reducerPath]: persistReducer(
    productsApiPersistConfig,
    productsApi.reducer
  ),
  [reviewsApi.reducerPath]: persistReducer(
    reviewsApiPersistConfig,
    reviewsApi.reducer
  ),
  [userApi.reducerPath]: persistReducer(userApiPersistConfig, userApi.reducer),
  [favoritesApi.reducerPath]: persistReducer(
    favoritesApiPersistConfig,
    favoritesApi.reducer
  ),
  [cartApi.reducerPath]: persistReducer(cartApiPersistConfig, cartApi.reducer),
  [filesApi.reducerPath]: persistReducer(
    filesApiPersistConfig,
    filesApi.reducer
  ),
  [userSlice.name]: persistReducer(userPersistConfig, userSlice.reducer),
  [cartSlice.name]: persistReducer(cartPersistConfig, cartSlice.reducer),
  [favoritesSlice.name]: persistReducer(
    favoritesPersistConfig,
    favoritesSlice.reducer
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(productsApi.middleware)
      .concat(reviewsApi.middleware)
      .concat(userApi.middleware)
      .concat(cartApi.middleware)
      .concat(favoritesApi.middleware)
      .concat(filesApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
