import { CartRepository, ProductRepository } from '../repositories';
import { NotFoundError } from '../utils/errors';

/**
 * Cart Service
 */
export class CartService {
  /**
   * Get cart
   */
  static async getCart(userId: string) {
    const cart = await CartRepository.getCart(userId);
    return this.formatCart(cart);
  }

  /**
   * Add to cart
   */
  static async addToCart(userId: string, productId: string, variantId: string | null, quantity: number) {
    // Validate product exists
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product');
    }

    // Check stock
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    await CartRepository.addToCart(userId, productId, variantId, quantity);
    return this.getCart(userId);
  }

  /**
   * Update cart item
   */
  static async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    // TODO: Implement update logic
    return this.getCart(userId);
  }

  /**
   * Remove from cart
   */
  static async removeFromCart(userId: string, cartItemId: string) {
    const cart = await CartRepository.getCart(userId);
    await CartRepository.removeFromCart(cart.id, cartItemId);
    return this.getCart(userId);
  }

  /**
   * Clear cart
   */
  static async clearCart(userId: string) {
    await CartRepository.clearCart(userId);
    return { message: 'Cart cleared successfully' };
  }

  /**
   * Format cart response
   */
  private static formatCart(cart: any) {
    let subtotal = 0;
    cart.items.forEach((item: any) => {
      subtotal += Number(item.price) * item.quantity;
    });

    const tax = Math.round((subtotal * 5) / 100 * 100) / 100; // 5% tax
    const shipping = subtotal > 5000 ? 0 : 100; // Free shipping above 5000
    const total = subtotal + tax + shipping;

    return {
      id: cart.id,
      items: cart.items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      shipping,
      discount: 0,
      total: Math.round(total * 100) / 100,
    };
  }
}
