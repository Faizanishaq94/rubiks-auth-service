import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(JSON.stringify(err));
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
}
