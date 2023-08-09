import { Request, Response } from 'express';

const currentUser = (req: Request, res: Response) => {
  const { user } = req;
  res.status(200).json(user);
};

export { currentUser };
