/**
 * Enum representing the fields by which users can be sorted.
 *
 * @enum {string}
 * @property {string} CreatedAt - Sort by the date the user was created.
 * @property {string} UpdatedAt - Sort by the date the user was last updated.
 * @property {string} Name - Sort by the user's name.
 * @property {string} Username - Sort by the user's username.
 * @property {string} Email - Sort by the user's email address.
 * @property {string} Role - Sort by the user's role.
 * @property {string} Phone - Sort by the user's phone number.
 * @property {string} Address - Sort by the user's address.
 */
export enum UsersSortField {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  Name = 'name',
  Username = 'username',
  Email = 'email',
  Role = 'role',
  Phone = 'phone',
  Address = 'address',
}
