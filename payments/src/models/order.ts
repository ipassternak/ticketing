import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CustomError, OrderStatus } from '@ipassternak-gittix/common-lib';

interface OrderAttrs {
  _id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
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
    price: {
      type: Number,
      required: [true, 'The price is required field'],
      min: [0.001, 'The price must be grater than 0'],
    },
    status: {
      type: String,
      required: [true, 'The status is required field'],
      enum: Object.values(OrderStatus),
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
  if (this.get('status') === OrderStatus.Cancelled)
    throw new CustomError('You cannot pay for an cancelled order', 400);
  if (this.get('status') === OrderStatus.Completed)
    throw new CustomError('You have already payed for this order', 400);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
