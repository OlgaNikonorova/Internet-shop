import { createApi } from "@reduxjs/toolkit/query/react";
import { AuthResponse } from "../models/auth/auth-response";
import RegisterCredentials from "../models/auth/register-credentials";
import LoginCredentials from "../models/auth/login-credentials";
import { baseQueryWithReauth } from "./base-query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/api/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    loginUser: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation } = authApi;
