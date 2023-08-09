import {
  ExpirationCompletedEvent,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
  nats,
} from '@ipassternak-gittix/common-lib';
import { Order } from '../../models/order';

nats.listen<ExpirationCompletedEvent>(
  Subjects.ExpirationCompleted,
  async (data, msg) => {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) throw new Error('Cancelled order not found');
    if (order.status !== OrderStatus.Completed) {
      order.set({ status: OrderStatus.Cancelled });
      order.save();
      await nats.publish<OrderCancelledEvent>(Subjects.OrderCancelled, {
        id: order._id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
    }
    msg.ack();
  }
);
