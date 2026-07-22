import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError, sendCreated } from '../utils/response';
import { loginSchema, signupSchema } from '../validators';
import { ValidationError } from '../utils/errors';

/**
 * Authentication Controller
 */
export class AuthController {
  /**
   * POST /api/v1/auth/signup
   */
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const validated = signupSchema.parse(req.body);
      const result = await AuthService.signup(validated);
      sendCreated(res, result, 'User registered successfully');
    } catch (error: any) {
      if (error.errors) {
        sendError(res, new ValidationError('Validation failed', error.errors));
      } else {
        sendError(res, error);
      }
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated.email, validated.password);
      sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      if (error.errors) {
        sendError(res, new ValidationError('Validation failed', error.errors));
      } else {
        sendError(res, error);
      }
    }
  }

  /**
   * POST /api/v1/auth/send-otp
   */
  static async sendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await AuthService.sendOTP(email);
      sendSuccess(res, result);
    } catch (error) {
      sendError(res, error as Error);
    }
  }

  /**
   * POST /api/v1/auth/verify-otp
   */
  static async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOTP(email, otp);
      sendSuccess(res, result, 'OTP verified successfully');
    } catch (error) {
      sendError(res, error as Error);
    }
  }
}
