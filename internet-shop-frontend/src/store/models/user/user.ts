import { UserRole } from "./user-role";
import { UserStatus } from "./user-status";

export default interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  address: string;
  phone: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
