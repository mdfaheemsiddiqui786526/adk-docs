import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/helpers';
import { AuthError } from '../utils/errors';

/**
 * Auth Middleware - Verify JWT Token
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({
        success: false,
        message: error.message,
        code: 'UNAUTHORIZED',
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }
  }
}

/**
 * Role-based Access Control
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        code: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
}
