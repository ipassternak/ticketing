import {
  nats,
  TicketUpdatedEvent,
  OrderCreatedEvent,
  OrderCancelledEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';
import { Ticket, TicketDock } from '../../models/ticket';

const publishUpdate = (ticket: TicketDock) =>
  nats.publish<TicketUpdatedEvent>(Subjects.TicketUpdated, {
    id: ticket._id,
    version: ticket.version,
    orderId: ticket.orderId,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });

nats.listen<OrderCreatedEvent>(Subjects.OrderCreated, async (data, msg) => {
  const ticket = await Ticket.findById(data.ticket.id);
  if (!ticket) throw new Error('Ordered ticket not found');
  ticket.set({ orderId: data.id });
  await ticket.save();
  await publishUpdate(ticket);
  msg.ack();
});

nats.listen<OrderCancelledEvent>(Subjects.OrderCancelled, async (data, msg) => {
  const ticket = await Ticket.findById(data.ticket.id);
  if (!ticket) throw new Error('Cancelled ticket not found');
  ticket.set({ orderId: undefined });
  await ticket.save();
  await publishUpdate(ticket);
  msg.ack();
});
