import { Request, Response, NextFunction } from 'express';
import { errorHandlers } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const handler = errorHandlers.get(err.name);
  const { errors, statusCode } = handler(err);
  res.status(statusCode).json(errors);
};
