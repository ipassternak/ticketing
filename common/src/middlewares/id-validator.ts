import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { CustomError } from '../errors/custom-error';

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string
) => {
  if (Types.ObjectId.isValid(id)) next();
  else next(new CustomError('Invalid ticket id', 400));
};
