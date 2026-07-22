import { Response } from 'express';
import { ApiResponse, ErrorResponse } from '../types';
import { ApiError } from './errors';

/**
 * Send Success Response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

/**
 * Send Paginated Response
 */
export function sendPaginatedSuccess<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  const totalPages = Math.ceil(total / limit);
  const response = {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
  return res.status(statusCode).json(response);
}

/**
 * Send Error Response
 */
export function sendError(
  res: Response,
  error: Error | ApiError,
  statusCode?: number
): Response {
  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      message: error.message,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
    return res.status(error.statusCode).json(response);
  }

  const response: ErrorResponse = {
    success: false,
    message: 'Internal Server Error',
    error: error.message || 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: statusCode || 500,
  };
  return res.status(statusCode || 500).json(response);
}

/**
 * Send Created Response
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}

/**
 * Send No Content Response
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}
