import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { AppError, BadRequestError, ConflictError, UnauthorizedError, UnprocessableError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { config } from '../../config/env.config';

const handleMongooseCastError = (err: mongoose.Error.CastError): AppError =>
  new BadRequestError(`Invalid ${err.path}: ${err.value}`);

const handleDuplicateKey = (err: any): AppError => {
  const field = Object.keys(err.keyValue)[0];
  const value = field ? err.keyValue[field] : 'unknown';
  return new ConflictError(`${field || 'Field'} '${value}' already exists`);
};

const handleValidationError = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new UnprocessableError('Validation failed', errors);
};

const handleZodError = (err: ZodError): AppError => {
  const errors = err.issues.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return new BadRequestError('Validation failed', errors);
};

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[${err.statusCode}] ${err.message}`);

  let error = err;

  if (err instanceof mongoose.Error.CastError) error = handleMongooseCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationError(err);
  if (err instanceof JsonWebTokenError) error = new UnauthorizedError('Invalid token');
  if (err instanceof TokenExpiredError) error = new UnauthorizedError('Token expired');
  if (err instanceof ZodError) error = handleZodError(err);

  if (config.isDev) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
      stack: error.stack,
    });
    return;
  }

  if (error.isOperational) {
    sendError(res, error.message, error.statusCode, error.errors);
  } else {
    logger.error('💥 UNEXPECTED ERROR:', error);
    sendError(res, 'Something went wrong. Please try again later.', 500);
  }
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};