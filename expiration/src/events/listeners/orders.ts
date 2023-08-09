import { expirationQueue } from '../../queues/expiration';
import {
  nats,
  OrderCreatedEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';

nats.listen<OrderCreatedEvent>(Subjects.OrderCreated, async (data, msg) => {
  const delay = new Date(data.expiresAt).getTime() - Date.now();
  await expirationQueue.add({ orderId: data.id }, { delay });
  msg.ack();
});
