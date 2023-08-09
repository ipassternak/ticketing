import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync, CustomError } from '@ipassternak-gittix/common-lib';
import { User } from '../models/user';
import { compare } from '../utils/password';

const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await compare(user.password, password)))
    throw new CustomError('Invalid email or password', 401);
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET!
  );
  req.session = { jwt: token };
  res.status(200).json(user);
});

export { signin };
