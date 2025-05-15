import { UserRole } from '../enums/user-role.enum';

/**
 * Represents the payload of a JSON Web Token (JWT) used for authentication and authorization.
 *
 * @property sup - A unique identifier for the subject of the token (USER ID).
 * @property username - The username of the authenticated user.
 * @property role - The role of the user, represented as a `UserRole` enum.
 * @property jti - unique token identifier.for validating
 */
export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  jti?: string;
}
