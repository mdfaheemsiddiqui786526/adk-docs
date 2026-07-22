import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { sendSuccess, sendPaginatedSuccess, sendError, sendCreated } from '../utils/response';
import { createOrderSchema } from '../validators';
import { ValidationError } from '../utils/errors';

/**
 * Order Controller
 */
export class OrderController {
  /**
   * POST /api/v1/orders
   */
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const validated = createOrderSchema.parse(req.body);
      const order = await OrderService.createOrder(req.user!.id, validated);
      sendCreated(res, order, 'Order created successfully');
    } catch (error: any) {
      if (error.errors) {
        sendError(res, new ValidationError('Validation failed', error.errors));
      } else {
        sendError(res, error);
      }
    }
  }

  /**
   * GET /api/v1/orders
   */
  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { orders, total } = await OrderService.getUserOrders(req.user!.id, page, limit);
      sendPaginatedSuccess(
        res,
        orders,
        total,
        page,
        limit,
        'Orders retrieved successfully'
      );
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * GET /api/v1/orders/:id
   */
  static async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const order = await OrderService.getOrder(req.user!.id, req.params.id);
      sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
      sendError(res, error as Error, 404);
    }
  }

  /**
   * POST /api/v1/orders/:id/cancel
   */
  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { reason } = req.body;
      const order = await OrderService.cancelOrder(req.user!.id, req.params.id, reason);
      sendSuccess(res, order, 'Order cancelled successfully');
    } catch (error) {
      sendError(res, error as Error);
    }
  }
}
