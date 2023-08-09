import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload | null;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { session } = req;
  try {
    if (!session?.jwt) throw new Error();
    const payload = jwt.verify(
      session.jwt,
      process.env.JWT_SECRET!
    ) as UserPayload;
    req.user = payload;
  } catch (err) {
    req.user = null;
  }
  next();
};
