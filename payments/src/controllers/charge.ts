import {
  catchAsync,
  CustomError,
  nats,
  OrderStatus,
  PaymentCompletedEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';

const charge = catchAsync(async (req, res) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new CustomError('Invalid order', 404);
  order.checkAccess(req.user!.id);
  try {
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.createOne({
      orderId: order._id,
      chargeId: charge.id,
    });
    await payment.save();
    order.status = OrderStatus.Completed;
    await order.save();
    await nats.publish<PaymentCompletedEvent>(Subjects.PaymentCompleted, {
      id: payment._id,
      orderId: payment.orderId,
      chargeId: payment.chargeId,
    });
    res.status(201).json(payment);
  } catch (err) {
    throw new CustomError('Failed to process payment', 400);
  }
});

export { charge };
