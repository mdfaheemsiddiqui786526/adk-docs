import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { productFilterSchema } from '../validators';

/**
 * Product Controller
 */
export class ProductController {
  /**
   * GET /api/v1/products
   */
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const filters = productFilterSchema.parse(req.query);
      const { products, total } = await ProductService.getProducts(
        filters,
        filters.page,
        filters.limit
      );
      sendPaginatedSuccess(
        res,
        products,
        total,
        filters.page,
        filters.limit,
        'Products retrieved successfully'
      );
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * GET /api/v1/products/:id
   */
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductDetails(req.params.id);
      sendSuccess(res, product);
    } catch (error) {
      sendError(res, error as Error, 404);
    }
  }

  /**
   * GET /api/v1/products/slug/:slug
   */
  static async getProductBySlug(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      sendSuccess(res, product);
    } catch (error) {
      sendError(res, error as Error, 404);
    }
  }

  /**
   * GET /api/v1/products/featured
   */
  static async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await ProductService.getFeaturedProducts(limit);
      sendSuccess(res, products, 'Featured products retrieved successfully');
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * GET /api/v1/products/bestsellers
   */
  static async getBestsellers(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await ProductService.getBestsellers(limit);
      sendSuccess(res, products, 'Bestsellers retrieved successfully');
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * GET /api/v1/products/new-arrivals
   */
  static async getNewArrivals(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await ProductService.getNewArrivals(limit);
      sendSuccess(res, products, 'New arrivals retrieved successfully');
    } catch (error) {
      sendError(res, error as Error);
    }
  }
}
