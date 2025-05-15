/**
 * Enum representing the status of a product.
 *
 * @enum {string}
 * @property {string} Active - Indicates that the product is active and available.
 * @property {string} Inactive - Indicates that the product is inactive and not available.
 * @property {string} Draft - Indicates that the product is in draft mode and not yet finalized.
 */
export enum ProductStatus {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft',
}
