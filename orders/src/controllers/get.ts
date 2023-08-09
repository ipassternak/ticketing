import { Request, Response } from 'express';
import { catchAsync, CustomError } from '@ipassternak-gittix/common-lib';
import { Order } from '../models/order';

const getAll = catchAsync(async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.user!.id,
  }).populate('ticket');
  res.status(200).json(orders);
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('ticket');
  if (!order) throw new CustomError('Invalid order', 404);
  order.checkAccess(req.user!.id);
  res.status(200).json(order);
});

export { getAll, getOne };
