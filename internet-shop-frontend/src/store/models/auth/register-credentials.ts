import { UserRole } from "../user/user-role";

export default interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  name: string;
  address: string;
  phone: string;
  avatar: string;
  role: UserRole;
}
