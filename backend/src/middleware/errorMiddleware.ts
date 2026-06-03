import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[API ERROR] ${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  if (env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production Mode: Hide server internals
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
      });
    }

    // Unhandled system or third-party errors
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};
