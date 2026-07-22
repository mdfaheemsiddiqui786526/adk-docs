import { OrderRepository, CartRepository } from '../repositories';
import { generateOrderNumber } from '../utils/helpers';
import { NotFoundError } from '../utils/errors';

/**
 * Order Service
 */
export class OrderService {
  /**
   * Create order from cart
   */
  static async createOrder(userId: string, data: any) {
    // Get cart
    const cart = await CartRepository.getCart(userId);
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map((item: any) => {
      const itemSubtotal = Number(item.price) * item.quantity;
      subtotal += itemSubtotal;
      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        subtotal: itemSubtotal,
      };
    });

    const tax = Math.round((subtotal * 5) / 100 * 100) / 100;
    const shipping = subtotal > 5000 ? 0 : 100;
    const discount = data.couponDiscount || 0;
    const total = subtotal + tax + shipping - discount;

    // Create order
    const order = await OrderRepository.create(userId, {
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      shipping,
      discount,
      total: Math.round(total * 100) / 100,
      billingAddressId: data.billingAddressId,
      shippingAddressId: data.shippingAddressId,
      paymentMethod: data.paymentMethod,
      couponId: data.couponId,
      notes: data.notes,
    });

    // Clear cart
    await CartRepository.clearCart(userId);

    return order;
  }

  /**
   * Get order
   */
  static async getOrder(userId: string, orderId: string) {
    const order = await OrderRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      throw new NotFoundError('Order');
    }
    return order;
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    return OrderRepository.getUserOrders(userId, page, limit);
  }

  /**
   * Cancel order
   */
  static async cancelOrder(userId: string, orderId: string, reason: string) {
    const order = await this.getOrder(userId, orderId);

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new Error('Cannot cancel this order');
    }

    return OrderRepository.updateStatus(orderId, 'CANCELLED');
  }
}
