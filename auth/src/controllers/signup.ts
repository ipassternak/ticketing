import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync, CustomError } from '@ipassternak-gittix/common-lib';
import { User } from '../models/user';

const signup = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exists = await User.exists({ email });
  if (exists) throw new CustomError('This email is already in use', 400);
  const user = User.createOne({ email, password });
  await user.save();
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET!
  );
  req.session = { jwt: token };
  res.status(201).json(user);
});

export { signup };
