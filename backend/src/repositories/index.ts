import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * User Repository
 */
export class UserRepository {
  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
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
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }

  /**
   * Update user
   */
  static async update(id: string, data: any) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Get user with related data
   */
  static async getUserWithDetails(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }
}

/**
 * Product Repository
 */
export class ProductRepository {
  /**
   * Find product by ID with details
   */
  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 5,
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
   * Get all products with filters
   */
  static async findAll(filters: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };

    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
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
        orderBy: this.getOrderBy(filters.sortBy, filters.sortOrder),
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  /**
   * Get featured products
   */
  static async getFeatured(limit: number = 8) {
    return prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  /**
   * Get best sellers
   */
  static async getBestsellers(limit: number = 8) {
    return prisma.product.findMany({
      where: { isBestseller: true, isActive: true },
      take: limit,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  /**
   * Get new arrivals
   */
  static async getNewArrivals(limit: number = 8) {
    return prisma.product.findMany({
      where: { isNew: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  /**
   * Get order by configuration
   */
  private static getOrderBy(sortBy?: string, sortOrder: string = 'desc') {
    const order: any = {};
    const field = sortBy || 'createdAt';
    order[field] = sortOrder;
    return order;
  }
}

/**
 * Cart Repository
 */
export class CartRepository {
  /**
   * Get user cart
   */
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
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

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
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

    return cart;
  }

  /**
   * Add to cart
   */
  static async addToCart(userId: string, productId: string, variantId: string | null, quantity: number) {
    let cart = await this.getCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true, variant: true },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
        price: product.price,
      },
      include: { product: true, variant: true },
    });
  }

  /**
   * Remove from cart
   */
  static async removeFromCart(cartId: string, cartItemId: string) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  /**
   * Clear cart
   */
  static async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
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
  static async create(userId: string, data: any) {
    return prisma.order.create({
      data: {
        userId,
        orderNumber: data.orderNumber,
        subtotal: data.subtotal,
        tax: data.tax,
        shipping: data.shipping,
        discount: data.discount,
        total: data.total,
        paymentMethod: data.paymentMethod,
        billingAddressId: data.billingAddressId,
        shippingAddressId: data.shippingAddressId,
        couponId: data.couponId,
        items: {
          create: data.items,
        },
      },
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
   * Get order by ID
   */
  static async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payment: true,
        shipment: true,
      },
    });
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
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
    });
  }

  /**
   * Get product reviews
   */
  static async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
        },
      }),
      prisma.review.count({ where: { productId, isApproved: true } }),
    ]);

    return { reviews, total };
  }
}

/**
 * Wishlist Repository
 */
export class WishlistRepository {
  /**
   * Get user wishlist
   */
  static async getUserWishlist(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [wishlist, total] = await Promise.all([
      prisma.wishlist.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          product: true,
        },
      }),
      prisma.wishlist.count({ where: { userId } }),
    ]);

    return { wishlist, total };
  }

  /**
   * Add to wishlist
   */
  static async addToWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      throw new ConflictError('Product already in wishlist');
    }

    return prisma.wishlist.create({
      data: { userId, productId },
    });
  }

  /**
   * Remove from wishlist
   */
  static async removeFromWishlist(userId: string, productId: string) {
    return prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
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
   * Validate coupon
   */
  static async validateCoupon(code: string) {
    const coupon = await this.findByCode(code);
    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    if (!coupon.isActive) {
      throw new ConflictError('Coupon is inactive');
    }

    if (coupon.validUntil < new Date()) {
      throw new ConflictError('Coupon has expired');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new ConflictError('Coupon usage limit exceeded');
    }

    return coupon;
  }
}
