import { Request, Response } from 'express';
import {
  catchAsync,
  CustomError,
  nats,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@ipassternak-gittix/common-lib';
import { Order } from '../models/order';

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('ticket');
  if (!order) throw new CustomError('Invalid order', 404);
  order.checkAccess(req.user!.id);
  order.status = OrderStatus.Cancelled;
  order.save();
  await nats.publish<OrderCancelledEvent>(Subjects.OrderCancelled, {
    id: order._id,
    version: order.version,
    ticket: {
      id: order.ticket._id,
    },
  });
  res.status(204).send();
});

export { deleteOne };
