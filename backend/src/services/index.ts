import bcrypt from 'bcryptjs';
import { validateEmail, generateOTP, generateAccessToken, generateRefreshToken } from '../utils/helpers';
import { UserRepository } from '../repositories';
import { AuthError, ValidationError, ConflictError } from '../utils/errors';
import { comparePassword, hashPassword } from '../utils/helpers';

/**
 * Authentication Service
 */
export class AuthService {
  /**
   * User Sign Up
   */
  static async signup(data: any) {
    // Validate email
    if (!validateEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Check if user exists
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await UserRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      emailVerified: false,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes
    };
  }

  /**
   * User Login
   */
  static async login(email: string, password: string) {
    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AuthError('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive || user.isBanned) {
      throw new AuthError('Account is inactive or banned');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }

  /**
   * Send OTP
   */
  static async sendOTP(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('User not found');
    }

    const otp = generateOTP(6);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserRepository.update(user.id, {
      otp: await hashPassword(otp),
      otpExpiresAt,
      otpAttempts: 0,
    });

    // TODO: Send OTP via email
    return { success: true, message: 'OTP sent to email' };
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(email: string, otp: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.otp) {
      throw new AuthError('Invalid OTP');
    }

    // Check OTP expiry
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AuthError('OTP expired');
    }

    // Check OTP attempts
    if (user.otpAttempts >= 5) {
      throw new AuthError('Too many OTP attempts. Please try again later.');
    }

    // Verify OTP
    const isOTPValid = await comparePassword(otp, user.otp);
    if (!isOTPValid) {
      await UserRepository.update(user.id, {
        otpAttempts: user.otpAttempts + 1,
      });
      throw new AuthError('Invalid OTP');
    }

    // Clear OTP
    await UserRepository.update(user.id, {
      otp: null,
      otpExpiresAt: null,
      otpAttempts: 0,
      emailVerified: true,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }
}

/**
 * Product Service
 */
export class ProductService {
  static async getProducts(filters: any) {
    const { ProductRepository } = require('../repositories');
    return ProductRepository.findAll(
      filters.page || 1,
      filters.limit || 10,
      filters
    );
  }

  static async getProductById(id: string) {
    const { ProductRepository } = require('../repositories');
    return ProductRepository.findById(id);
  }

  static async getProductBySlug(slug: string) {
    const { ProductRepository } = require('../repositories');
    return ProductRepository.findBySlug(slug);
  }

  static async getFeaturedProducts(limit: number = 10) {
    const { ProductRepository } = require('../repositories');
    return ProductRepository.getFeatured(limit);
  }
}

/**
 * Cart Service
 */
export class CartService {
  static async getCart(userId: string) {
    const { CartRepository } = require('../repositories');
    let cart = await CartRepository.findByUserId(userId);

    if (!cart) {
      cart = await CartRepository.create(userId);
    }

    return cart;
  }

  static async addToCart(
    userId: string,
    productId: string,
    variantId: string | null,
    quantity: number,
    price: number
  ) {
    const { CartRepository } = require('../repositories');
    let cart = await CartRepository.findByUserId(userId);

    if (!cart) {
      cart = await CartRepository.create(userId);
    }

    return CartRepository.addItem(cart.id, productId, variantId, quantity, price);
  }
}

export default {
  AuthService,
  ProductService,
  CartService,
};
