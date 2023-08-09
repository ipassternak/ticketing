import { Request, Response } from 'express';
import {
  nats,
  OrderCreatedEvent,
  Subjects,
  CustomError,
  catchAsync,
} from '@ipassternak-gittix/common-lib';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const createOne = catchAsync(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.body.ticketId);
  if (!ticket) throw new CustomError('Invalid ticket', 404);
  const isReserved = await ticket.isReserved();
  if (isReserved) throw new CustomError('Ticket is already reserved', 400);
  const order = Order.createOne({
    userId: req.user!.id,
    ticket,
  });
  await order.save();
  await nats.publish<OrderCreatedEvent>(Subjects.OrderCreated, {
    id: order._id,
    userId: req.user!.id,
    expiresAt: order.expiresAt.toISOString(),
    version: order.version,
    status: order.status,
    ticket: {
      id: ticket._id,
      price: ticket.price,
    },
  });
  res.status(201).json(order);
});

export { createOne };
