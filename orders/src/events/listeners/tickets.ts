import {
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  nats,
} from '@ipassternak-gittix/common-lib';
import { Ticket } from '../../models/ticket';

nats.listen<TicketCreatedEvent>(Subjects.TicketCreated, async (data, msg) => {
  const { id, title, price } = data;
  const ticket = Ticket.createOne({ _id: id, title, price });
  await ticket.save();
  msg.ack();
});

nats.listen<TicketUpdatedEvent>(Subjects.TicketUpdated, async (data, msg) => {
  const ticket = await Ticket.findCurrent(data);
  if (!ticket) throw new Error('Updated ticket not found');
  const { title, price } = data;
  ticket.set({ title, price });
  await ticket.save();
  msg.ack();
});
