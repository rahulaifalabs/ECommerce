// AUTO-ADDED Zod middleware
import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
export const zodValidate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, errors: result.error.format() });
  }
  req.body = result.data;
  next();
};
