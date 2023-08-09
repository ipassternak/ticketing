import { Request, Response } from 'express';
import {
  catchAsync,
  CustomError,
  nats,
  TicketUpdatedEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';
import { Ticket } from '../models/ticket';

const updateOne = catchAsync(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new CustomError('Invalid ticket', 404);
  ticket.checkAccess(req.user!.id);
  const { title, price } = req.body;
  ticket.set({ title, price });
  await ticket.save();
  await nats.publish<TicketUpdatedEvent>(Subjects.TicketUpdated, {
    id: ticket._id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });
  res.status(200).json({ ticket });
});

export { updateOne };
