/**
 * Enum representing the roles a user can have in the system.
 *
 * @enum {string}
 * @property {string} User - Represents a regular user with basic access.
 * @property {string} Admin - Represents an administrator with elevated privileges.
 * @property {string} Seller - Represents a user with seller-specific access.
 *
 */
export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Seller = 'seller',
}
