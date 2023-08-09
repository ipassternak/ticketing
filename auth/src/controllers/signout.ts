import { Request, Response } from 'express';

const signout = (req: Request, res: Response) => {
  req.session = null;
  res.status(204).send();
};

export { signout };
