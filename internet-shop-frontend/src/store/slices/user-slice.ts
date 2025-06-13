import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserRole } from "../models/user/user-role";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type UserState = AuthTokens & {
  username: string | null;
  role: UserRole | null;
};

const initialState: UserState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  role: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role;
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    updateUserRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
  },
});

export const selectCurrentUser = (state: RootState) => state.user;

export const selectUserRole = (state: RootState) => state.user.role;

export const { login, logout, updateTokens } = userSlice.actions;

export const isAuthSelector = (state: RootState) =>
  !!state.user.accessToken && !!state.user.refreshToken;
export const usernameSelector = (state: RootState) => state.user.username;
export const accessTokenSelector = (state: RootState) => state.user.accessToken;
export const refreshTokenSelector = (state: RootState) =>
  state.user.refreshToken;

export default userSlice.reducer;
