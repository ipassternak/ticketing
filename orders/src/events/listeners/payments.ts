import {
  nats,
  OrderStatus,
  PaymentCompletedEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';
import { Order } from '../../models/order';

nats.listen<PaymentCompletedEvent>(
  Subjects.PaymentCompleted,
  async (data, msg) => {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error('Completed order not found');
    order.status = OrderStatus.Completed;
    order.save();
    msg.ack();
  }
);
