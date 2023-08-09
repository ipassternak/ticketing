import { Request, Response } from 'express';
import {
  catchAsync,
  nats,
  TicketCreatedEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';
import { Ticket } from '../models/ticket';

const createOne = catchAsync(async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.createOne({
    title,
    price,
    userId: req.user!.id,
  });
  await ticket.save();
  await nats.publish<TicketCreatedEvent>(Subjects.TicketCreated, {
    id: ticket._id,
    title: ticket.title,
    price: ticket.price,
    version: ticket.version,
    userId: ticket.userId,
  });
  res.status(201).json(ticket);
});

export { createOne };
