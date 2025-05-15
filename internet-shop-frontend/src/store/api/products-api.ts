import { baseQueryWithReauth } from "./base-query";
import Product from "../models/product/product";
import { createApi } from "@reduxjs/toolkit/query/react";
import PaginatedProductsRequest from "../models/product/paginated-products-request";
import CreateProduct from "../models/product/create-product";
import ProductsPage from "../models/product/products-page";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: "/api/products",
        method: "GET",
      }),
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "GET",
      }),
    }),

    getPaginatedProducts: builder.query<ProductsPage, PaginatedProductsRequest>(
      {
        query: (params) => {
          const searchParams = new URLSearchParams();

          Object.entries(params).forEach(([key, value]) => {
            if (key === "sort" && Array.isArray(value)) {
              value.forEach((sortObj) => {
                searchParams.append("sort", JSON.stringify(sortObj));
              });
            } else if (value !== undefined) {
              searchParams.append(key, String(value));
            }
          });

          return {
            url: `/api/products/page?${searchParams.toString()}`,
            method: "GET",
          };
        },
      }
    ),

    createProduct: builder.mutation<Product, CreateProduct>({
      query: () => ({
        url: "/api/products",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetPaginatedProductsQuery,
  useCreateProductMutation,
  useGetProductQuery,
} = productsApi;
