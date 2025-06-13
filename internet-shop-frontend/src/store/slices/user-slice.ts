import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type UserState = AuthTokens & {
  username: string | null;
  avatar?: string;
};

const initialState: UserState = {
  username: null,
  avatar: undefined,
  accessToken: null,
  refreshToken: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { login, logout, updateTokens, setAvatar } = userSlice.actions;

export const isAuthSelector = (state: RootState) =>
  !!state.user.accessToken && !!state.user.refreshToken;
export const usernameSelector = (state: RootState) => state.user.username;
export const accessTokenSelector = (state: RootState) => state.user.accessToken;
export const refreshTokenSelector = (state: RootState) =>
  state.user.refreshToken;
export const avatarSelector = (state: RootState) =>
  state.user.avatar;

export default userSlice.reducer;
