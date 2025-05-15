import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-query";
import Cart from "../models/cart/cart";
import CartPage from "../models/cart/cart-page";
import PaginatedCartItemsProductsRequest from "../models/cart/paginated-cart-items-products-request";
import CartItem from "../models/cart/cart-item";
import AddItemToCart from "../models/cart/add-item-to-cart";
import UpdateCartItem from "../models/cart/update-cart-item";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUserCart: builder.query<Cart, void>({
      query: () => ({
        url: "/api/cart",
        method: "GET",
      }),
    }),

    getPaginatedCartItemsProducts: builder.query<
      CartPage,
      PaginatedCartItemsProductsRequest
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });

        return {
          url: `/api/cart/page?${searchParams.toString()}`,
          method: "GET",
        };
      },
    }),

    addItemToCart: builder.mutation<CartItem, AddItemToCart>({
      query: (addItemToCart) => ({
        url: "/api/cart/add",
        method: "POST",
        body: addItemToCart,
      }),
    }),

    updateCartItemQuantity: builder.mutation<
      CartItem,
      { cartItemId: string; updateCartItem: UpdateCartItem }
    >({
      query: ({ cartItemId, updateCartItem }) => ({
        url: `/api/cart/item/${cartItemId}`,
        method: "PATCH",
        body: updateCartItem,
      }),
    }),

    removeItemFromCart: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/cart/item/${id}`,
        method: "DELETE",
      }),
    }),

    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: "/api/cart/clear",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useGetPaginatedCartItemsProductsQuery,
  useAddItemToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveItemFromCartMutation,
  useClearCartMutation,
} = cartApi;
