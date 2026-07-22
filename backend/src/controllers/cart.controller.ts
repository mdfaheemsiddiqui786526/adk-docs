import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { sendSuccess, sendError } from '../utils/response';
import { addToCartSchema, updateCartItemSchema } from '../validators';
import { ValidationError } from '../utils/errors';

/**
 * Cart Controller
 */
export class CartController {
  /**
   * GET /api/v1/cart
   */
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const cart = await CartService.getCart(req.user!.id);
      sendSuccess(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * POST /api/v1/cart/add
   */
  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const validated = addToCartSchema.parse(req.body);
      const cart = await CartService.addToCart(
        req.user!.id,
        validated.productId,
        validated.variantId || null,
        validated.quantity
      );
      sendSuccess(res, cart, 'Item added to cart');
    } catch (error: any) {
      if (error.errors) {
        sendError(res, new ValidationError('Validation failed', error.errors));
      } else {
        sendError(res, error);
      }
    }
  }

  /**
   * PATCH /api/v1/cart/items/:itemId
   */
  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const validated = updateCartItemSchema.parse(req.body);
      const cart = await CartService.updateCartItem(
        req.user!.id,
        req.params.itemId,
        validated.quantity
      );
      sendSuccess(res, cart, 'Cart item updated');
    } catch (error: any) {
      if (error.errors) {
        sendError(res, new ValidationError('Validation failed', error.errors));
      } else {
        sendError(res, error);
      }
    }
  }

  /**
   * DELETE /api/v1/cart/items/:itemId
   */
  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const cart = await CartService.removeFromCart(req.user!.id, req.params.itemId);
      sendSuccess(res, cart, 'Item removed from cart');
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * DELETE /api/v1/cart
   */
  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const result = await CartService.clearCart(req.user!.id);
      sendSuccess(res, result, 'Cart cleared');
    } catch (error) {
      sendError(res, error as Error);
    }
  }
}
