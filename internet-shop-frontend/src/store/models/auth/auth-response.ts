import User from "../user/user";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
