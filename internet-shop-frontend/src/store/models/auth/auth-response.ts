import User from "../user/user";
import { UserRole } from "../user/user-role";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
