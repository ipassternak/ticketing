import mongoose from 'mongoose';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CustomError, OrderStatus } from '@ipassternak-gittix/common-lib';

const expWindow = parseInt(process.env.ORDER_EXPIRATION_WINDOW_MS!);

interface OrderAttrs {
  userId: string;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
  checkAccess(userId: string): void;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  createOne(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'The userId is required field'],
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + expWindow),
    },
    ticket: {
      type: mongoose.Schema.ObjectId,
      ref: 'Ticket',
      required: [true, 'The ticket is required field'],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.createOne = (attrs: OrderAttrs) => new Order(attrs);
orderSchema.methods.checkAccess = function (userId: string) {
  if (userId !== this.get('userId'))
    throw new CustomError(
      'You do not have permission to perform this action',
      403
    );
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
