import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserRole } from "../models/user/user-role";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
  resetToken: string | null;
};

type UserState = AuthTokens & {
  username: string | null;
  role: UserRole | null;
  avatar: string | null;
};

const initialState: UserState = {
  username: null,
  avatar: null,
  accessToken: null,
  refreshToken: null,
  resetToken: null,
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
      state.avatar = action.payload.avatar;
    },

    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    setResetToken: (state, action: PayloadAction<string>) => {
      state.resetToken = action.payload;
    },

    logout: (state) => {
      Object.assign(state, initialState);
    },

    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },

    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },

    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const {
  login,
  logout,
  updateTokens,
  setAvatar,
  setUsername,
  setUserRole,
  setResetToken
} = userSlice.actions;

export const isAuthSelector = (state: RootState) =>
  !!state.user.accessToken && !!state.user.refreshToken;
export const usernameSelector = (state: RootState) => state.user.username;
export const accessTokenSelector = (state: RootState) => state.user.accessToken;
export const refreshTokenSelector = (state: RootState) =>
  state.user.refreshToken;
export const avatarSelector = (state: RootState) => state.user.avatar;
export const userRoleSelector = (state: RootState) => state.user.role;
export const resetTokenSelector = (state: RootState) => state.user.resetToken;

export default userSlice.reducer;
