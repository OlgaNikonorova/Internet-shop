import { CreateProductDto } from '@dto/product/create-product.dto';
import { UpdateProductDto } from '@dto/product/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductFiltersDto } from '@dto/product/product-filters.dto';
import { ProductPage } from '../models/product-page';
import { BulkProductsDto } from '@dto/product/bulk-product.dto';

/**
 * Interface representing the product service.
 * Provides methods for managing products in the system.
 */
export interface IProductService {
  /**
   * Creates a new product.
   *
   * @param product - The data transfer object containing the details of the product to create.
   * @returns A promise that resolves to the created product.
   */
  createAsync(product: CreateProductDto): Promise<Product>;

  /**
   * Retrieves all products.
   *
   * @returns A promise that resolves to an array of all products.
   */
  findAllAsync(): Promise<Product[]>;

  /**
   * Retrieves all products by filters.
   *
   * @param filtersDto - The data transfer object containing the filters for retrieving products.
   * @returns A promise that resolves to product page with page params and an array of all products.
   */
  getAllPage(filtersDto: ProductFiltersDto): Promise<ProductPage>;

  /**
   * Finds a product by its unique identifier.
   *
   * @param userId - The unique identifier of the user requesting the product.
   * @param productId - The unique identifier of the product.
   * @returns A promise that resolves to the product if found, or null if not found.
   */
  findByIdOrThrowNotFoundAsync(
    userId: string,
    productId: string,
  ): Promise<Product>;

  /**
   * Updates an existing product.
   *
   * @param userId - The unique identifier of the user requesting the product.
   * @param productId - The unique identifier of the product to update.
   * @param product - A partial data transfer object containing the updated product details.
   * @returns A promise that resolves to the updated product.
   */
  updateAsync(
    userId: string,
    productId: string,
    product: UpdateProductDto,
  ): Promise<Product>;

  /**
   * Deletes a product by its unique identifier.
   *
   * @param id - The unique identifier of the product to delete.
   * @returns A promise that resolves when the product is successfully deleted.
   */
  deleteAsync(id: string): Promise<void>;

  /**
   * Updates multiple products in bulk.
   * @param bulkDto - The data transfer object containing the details for the bulk update.
   */
  bulkUpdate(bulkDto: BulkProductsDto): Promise<void>;
}
