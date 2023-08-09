import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) throw new CustomError('Not authorized', 401);
  next();
};
