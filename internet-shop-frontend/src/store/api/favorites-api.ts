import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-query";
import Product from "../models/product/product";
import AddToFavorites from "../models/favorites/add-to-favorites";
import FavoritesPage from "../models/favorites/favorites-page";
import PaginatedFavoriteProductsRequest from "../models/favorites/paginated-favorite-products-request";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUserFavorites: builder.query<Product[], void>({
      query: () => ({
        url: "/api/favorites",
        method: "GET",
      }),
    }),

    getPaginatedFavoriteProducts: builder.query<
      FavoritesPage,
      PaginatedFavoriteProductsRequest
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/api/favorites/page?${searchParams.toString()}`,
          method: "GET",
        };
      },
    }),

    addProductToFavorites: builder.mutation<Product, AddToFavorites>({
      query: (addToFavorites) => ({
        url: "/api/favorites",
        method: "POST",
        body: addToFavorites,
      }),
    }),

    removeProductFromFavorites: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/api/favorites/${productId}`,
        method: "DELETE",
      }),
    }),

    clearFavorites: builder.mutation<void, void>({
      query: () => ({
        url: "/api/favorites/clear",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserFavoritesQuery,
  useGetPaginatedFavoriteProductsQuery,
  useAddProductToFavoritesMutation,
  useRemoveProductFromFavoritesMutation,
  useClearFavoritesMutation,
} = favoritesApi;
