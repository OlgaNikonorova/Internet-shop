import { UserRole } from "./user-role";
import { UserStatus } from "./user-status";

export default interface UpdateUser {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
  address?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}
