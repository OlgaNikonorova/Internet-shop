import { UserUpdateDto } from '@dto/users/user-update.dto';
import { User } from '../entities/user.entity';
import { RegisterDto } from '@dto/auth/register.dto';
import { UsersFiltersDto } from '@dto/users/users-filters.dto';
import { UserPage } from '../models/user-page';
import { UserRole } from '../enums/user-role.enum';
import { BulkUsersDto } from '@dto/users/bulk-users.dto';

/**
 * Interface representing the user service.
 * Provides methods for managing user entities.
 */
export interface IUserService {
  /**
   * Retrieves all users.
   *
   * @returns A promise that resolves to an array of users.
   */
  get(): Promise<User[]>;

  /**
   * Retrieves all users.
   *
   * @returns A promise that resolves to an array of users.
   */
  getPage(filters: UsersFiltersDto): Promise<UserPage>;

  /**
   * Creates a new user.
   *
   * @param userData - The users' data.
   * @returns A promise that resolves when the user is successfully created.
   */
  create(userData: RegisterDto): Promise<void>;

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user if found.
   */
  findById(id: string): Promise<User>;

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user.
   * @returns A promise that resolves to the user if found.
   */
  findByEmail(email: string): Promise<User>;

  /**
   * Updates an existing user.
   *
   * @param id - The unique identifier of the user to update.
   * @param user - The data to update the user with.
   * @returns A promise that resolves to the updated user entity.
   */
  update(id: string, user: UserUpdateDto): Promise<User>;

  /**
   * Deletes a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves when the user is successfully deleted.
   */
  delete(id: string): Promise<void>;

  /**
   * Retrieves the current user by their unique identifier.
   *
   * @param userId - The unique identifier of the current user.
   * @returns A promise that resolves to the current user.
   */
  getCurrentUser(userId: string): Promise<User>;

  /**
   * Updates the role of an existing user.
   *
   * @param id - The unique identifier of the user to update.
   * @param role - The new role to assign to the user.
   * @returns A promise that resolves to the updated user entity.
   */
  updateRole(id: string, role: UserRole): Promise<User>;

  /**
   * Bans a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to ban.
   * @returns A promise that resolves to the banned user entity.
   */
  ban(id: string): Promise<User>;

  /**
   * Unbans a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to unban.
   * @returns A promise that resolves to the unbanned user entity.
   */
  unban(id: string): Promise<User>;

  /**
   * Updates multiple users in bulk.
   *
   * @param bulkDto - The data transfer object containing user updates.
   * @returns A promise that resolves when the users are successfully updated.
   */
  bulkUpdate(bulkDto: BulkUsersDto): Promise<void>;
}
