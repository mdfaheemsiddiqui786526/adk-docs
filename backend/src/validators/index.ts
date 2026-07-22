import { z } from 'zod';

/**
 * Auth Validators
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

/**
 * User Validators
 */
export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  email: z.string().email(),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'Invalid pin code'),
  type: z.enum(['HOME', 'OFFICE', 'OTHER']).optional(),
  isDefault: z.boolean().optional(),
});

/**
 * Product Validators
 */
export const productFilterSchema = z.object({
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'price', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().positive().optional(),
  categoryId: z.string(),
  brandId: z.string().optional(),
  sku: z.string().unique,
  stock: z.coerce.number().default(0),
  images: z.array(z.string().url()).optional(),
});

/**
 * Cart Validators
 */
export const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.coerce.number().min(1).max(100),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().min(1).max(100),
});

/**
 * Order Validators
 */
export const createOrderSchema = z.object({
  billingAddressId: z.string(),
  shippingAddressId: z.string(),
  paymentMethod: z.enum([
    'RAZORPAY',
    'STRIPE',
    'PAYPAL',
    'UPI',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'NET_BANKING',
    'EMI',
    'WALLET',
    'GIFT_CARD',
    'COD',
  ]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Review Validators
 */
export const createReviewSchema = z.object({
  productId: z.string(),
  title: z.string().min(3),
  content: z.string().min(10),
  rating: z.coerce.number().min(1).max(5),
  images: z.array(z.string().url()).optional(),
});

/**
 * Coupon Validators
 */
export const validateCouponSchema = z.object({
  code: z.string(),
  cartTotal: z.coerce.number().positive(),
});
