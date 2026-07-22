import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories';
import { generateAccessToken, generateRefreshToken, generateOTP, hashPassword, comparePassword } from '../utils/helpers';
import { AuthError, ValidationError, ConflictError } from '../utils/errors';
import { validateEmail } from '../utils/helpers';

/**
 * Authentication Service
 */
export class AuthService {
  /**
   * User Registration
   */
  static async signup(data: any) {
    // Validate email
    if (!validateEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password
    if (data.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
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

    // Save refresh token to session
    // TODO: Save to Redis or database

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
      expiresIn: 900, // 15 minutes
    };
  }

  /**
   * User Login
   */
  static async login(email: string, password: string) {
    // Validate email
    if (!validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    // Find user
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthError('User account is inactive');
    }

    if (user.isBanned) {
      throw new AuthError('User account is banned');
    }

    // Compare password
    if (!user.password) {
      throw new AuthError('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid email or password');
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
      expiresIn: 900, // 15 minutes
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

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserRepository.update(user.id, {
      otp,
      otpExpiresAt,
      otpAttempts: 0,
    });

    // TODO: Send OTP via email
    console.log(`OTP for ${email}: ${otp}`);

    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify OTP and Login
   */
  static async verifyOTP(email: string, otp: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (!user.otp) {
      throw new AuthError('No OTP sent for this email');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new AuthError('OTP has expired');
    }

    if (user.otpAttempts >= 5) {
      throw new AuthError('Maximum OTP attempts exceeded');
    }

    if (user.otp !== otp) {
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
      expiresIn: 900,
    };
  }
}
