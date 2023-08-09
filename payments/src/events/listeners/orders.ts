import {
  nats,
  OrderCreatedEvent,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@ipassternak-gittix/common-lib';
import { Order } from '../../models/order';

nats.listen<OrderCreatedEvent>(Subjects.OrderCreated, async (data, msg) => {
  const order = Order.createOne({
    _id: data.id,
    userId: data.userId,
    status: data.status,
    version: data.version,
    price: data.ticket.price,
  });
  await order.save();
  msg.ack();
});

nats.listen<OrderCancelledEvent>(Subjects.OrderCancelled, async (data, msg) => {
  const order = await Order.findById(data.id);
  if (!order) throw new Error('Cancelled order not found');
  order.status = OrderStatus.Cancelled;
  order.save();
  msg.ack();
});
