import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * User Repository - Database operations for users
 */
export class UserRepository {
  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create user
   */
  static async create(data: any) {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update user
   */
  static async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Get all users with pagination
   */
  static async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }
}

/**
 * Product Repository
 */
export class ProductRepository {
  /**
   * Find all products with filters
   */
  static async findAll(
    page: number = 1,
    limit: number = 10,
    filters: any = {}
  ) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  /**
   * Find product by ID
   */
  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: true,
        reviews: {
          include: { user: true },
        },
      },
    });
  }

  /**
   * Find product by slug
   */
  static async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });
  }

  /**
   * Get featured products
   */
  static async getFeatured(limit: number = 10) {
    return prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      include: { category: true, brand: true },
    });
  }

  /**
   * Get bestsellers
   */
  static async getBestsellers(limit: number = 10) {
    return prisma.product.findMany({
      where: { isBestseller: true, isActive: true },
      take: limit,
      include: { category: true, brand: true },
    });
  }
}

/**
 * Cart Repository
 */
export class CartRepository {
  /**
   * Get cart by user ID
   */
  static async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  /**
   * Create cart
   */
  static async create(userId: string) {
    return prisma.cart.create({
      data: { userId },
    });
  }

  /**
   * Add item to cart
   */
  static async addItem(
    cartId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
    price: number
  ) {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
        variantId,
        quantity,
        price,
      },
      include: { product: true, variant: true },
    });
  }

  /**
   * Update cart item
   */
  static async updateItem(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  /**
   * Remove item from cart
   */
  static async removeItem(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Clear cart
   */
  static async clear(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

/**
 * Order Repository
 */
export class OrderRepository {
  /**
   * Create order
   */
  static async create(data: any) {
    return prisma.order.create({
      data,
      include: {
        items: { include: { product: true } },
      },
    });
  }

  /**
   * Find order by ID
   */
  static async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        user: true,
        coupon: true,
        payment: true,
        shipment: true,
      },
    });
  }

  /**
   * Find user orders
   */
  static async findByUserId(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total };
  }

  /**
   * Update order status
   */
  static async updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}

/**
 * Review Repository
 */
export class ReviewRepository {
  /**
   * Create review
   */
  static async create(data: any) {
    return prisma.review.create({
      data,
      include: { user: true },
    });
  }

  /**
   * Get product reviews
   */
  static async findByProductId(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        skip,
        take: limit,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId, isApproved: true } }),
    ]);

    return { reviews, total };
  }

  /**
   * Find review by ID
   */
  static async findById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: { user: true, product: true },
    });
  }
}

/**
 * Coupon Repository
 */
export class CouponRepository {
  /**
   * Find coupon by code
   */
  static async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Check coupon validity
   */
  static async isValid(code: string) {
    const coupon = await this.findByCode(code);
    if (!coupon) return false;

    const now = new Date();
    if (coupon.validFrom > now || coupon.validUntil < now) return false;
    if (!coupon.isActive) return false;
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return false;

    return true;
  }
}

/**
 * Category Repository
 */
export class CategoryRepository {
  /**
   * Get all categories
   */
  static async findAll() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: { subcategories: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  /**
   * Find category by ID
   */
  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });
  }
}

export default {
  UserRepository,
  ProductRepository,
  CartRepository,
  OrderRepository,
  ReviewRepository,
  CouponRepository,
  CategoryRepository,
};
