import { Request, Response, NextFunction } from 'express';

/**
 * Error Handling Middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', err);

  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code || 'ERROR',
    });
  } else if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      code: 'VALIDATION_ERROR',
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
}
