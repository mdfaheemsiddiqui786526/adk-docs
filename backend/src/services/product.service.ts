import { ProductRepository } from '../repositories';

/**
 * Product Service
 */
export class ProductService {
  /**
   * Get product details
   */
  static async getProductDetails(productId: string) {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  /**
   * Get product by slug
   */
  static async getProductBySlug(slug: string) {
    const product = await ProductRepository.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  /**
   * Get all products with filters
   */
  static async getProducts(filters: any, page: number = 1, limit: number = 10) {
    return ProductRepository.findAll(filters, page, limit);
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit: number = 8) {
    return ProductRepository.getFeatured(limit);
  }

  /**
   * Get bestsellers
   */
  static async getBestsellers(limit: number = 8) {
    return ProductRepository.getBestsellers(limit);
  }

  /**
   * Get new arrivals
   */
  static async getNewArrivals(limit: number = 8) {
    return ProductRepository.getNewArrivals(limit);
  }
}
