import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { sendError } from '../utils/response'

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    sendError(res, { errors: result.error.issues }, 400);
    return;
  }
  req.body = result.data;
  next();
};
