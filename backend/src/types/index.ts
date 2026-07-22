// Backend Types and Interfaces

/**
 * API Response Structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Pagination
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Authentication
 */
export interface AuthPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Product
 */
export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  thumbnail?: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  createdAt: Date;
}

/**
 * Cart
 */
export interface CartItemResponse {
  id: string;
  product: ProductResponse;
  variant?: {
    id: string;
    name: string;
    color?: string;
    size?: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

/**
 * Order
 */
export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  items: OrderItemResponse[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemResponse {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Error Response
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  code: string;
  statusCode: number;
}
