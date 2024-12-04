import { Request, Response, NextFunction } from 'express';

// Custom error interface
interface AppError extends Error {
  statusCode?: number;
}

// Error-handling middleware
export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${message}`, err);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
