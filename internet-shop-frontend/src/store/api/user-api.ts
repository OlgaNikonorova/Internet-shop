import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base-query";
import User from "../models/user/user";
import UpdateUser from "../models/user/update-user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/api/users/me",
        method: "GET",
      }),
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "GET",
      }),
    }),

    updateUserById: builder.mutation<
      User,
      { id: string; updateUser: UpdateUser }
    >({
      query: ({ id, updateUser }) => ({
        url: `/api/users/${id}`,
        method: "PATCH",
        body: updateUser,
      }),
    }),

    deleteUserById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
  useGetUserByIdQuery,
} = userApi;
