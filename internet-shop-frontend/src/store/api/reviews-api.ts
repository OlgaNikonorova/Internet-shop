import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-query";
import Review from "../models/review/review";
import CreateReview from "../models/review/create-review";
import UpdateReview from "../models/review/update-review";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], string>({
      query: (productId) => ({
        url: `/api/reviews/${productId}`,
        method: "GET",
      }),
    }),

    getReviewById: builder.query<Review, string>({
      query: (reviewId) => ({
        url: `/api/reviews/review/${reviewId}`,
        method: "GET",
      }),
    }),

    createReview: builder.mutation<
      Review,
      { productId: string; createReview: CreateReview }
    >({
      query: ({ productId, createReview }) => ({
        url: `/api/reviews/${productId}`,
        method: "POST",
        body: createReview,
      }),
    }),

    updateReview: builder.mutation<
      Review,
      { productId: string; updateReview: UpdateReview }
    >({
      query: ({ productId, updateReview }) => ({
        url: `/api/reviews/${productId}`,
        method: "PATCH",
        body: updateReview,
      }),
    }),

    updateReviewById: builder.mutation<
      Review,
      { reviewId: string; updateReview: UpdateReview }
    >({
      query: ({ reviewId, updateReview }) => ({
        url: `/api/reviews/review/${reviewId}`,
        method: "PATCH",
        body: updateReview,
      }),
    }),

    deleteReview: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/api/reviews/${productId}`,
        method: "DELETE",
      }),
    }),

    deleteReviewById: builder.mutation<void, string>({
      query: (reviewId) => ({
        url: `/api/reviews/review/${reviewId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewByIdQuery,
  useUpdateReviewByIdMutation,
  useDeleteReviewByIdMutation,
} = reviewsApi;
