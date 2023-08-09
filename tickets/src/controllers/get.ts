import { Request, Response } from 'express';
import { catchAsync, CustomError } from '@ipassternak-gittix/common-lib';
import { Ticket } from '../models/ticket';

const getAll = catchAsync(async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });
  res.status(200).json(tickets);
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new CustomError('Invalid ticket', 404);
  res.status(200).json(ticket);
});

export { getAll, getOne };
