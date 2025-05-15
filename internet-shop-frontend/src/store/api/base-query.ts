import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, updateTokens } from "../slices/user-slice";
import { AuthResponse } from "../models/auth/auth-response";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    console.log("Refreshing token");
    const refreshToken = (api.getState() as RootState).user.refreshToken;

    if (refreshToken) {
      const refreshResponse = (
        await baseQuery(
          {
            url: "/api/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        )
      ).data as AuthResponse | undefined;

      if (refreshResponse) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse;

        api.dispatch(
          updateTokens({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
