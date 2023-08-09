import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CustomError } from '@ipassternak-gittix/common-lib';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDock> {
  createOne(attrs: TicketAttrs): TicketDock;
}

export interface TicketDock extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
  checkAccess(userId: string): void;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'The title is required field'],
      validate: {
        validator: function (value: string) {
          return value.trim() !== '';
        },
        message: () => 'The title must not be empty',
      },
    },
    price: {
      type: Number,
      required: [true, 'The price is required field'],
      min: [0.001, 'The price must be grater than 0'],
    },
    userId: {
      type: String,
      required: [true, 'The userId is required field'],
    },
    orderId: {
      type: String,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createOne = (attrs: TicketAttrs) => new Ticket(attrs);

ticketSchema.methods.checkAccess = function (userId: string) {
  if (userId !== this.get('userId'))
    throw new CustomError(
      'You do not have permission to perform this action',
      403
    );
  if (this.get('orderId'))
    throw new CustomError('You cannot update received ticket', 400);
};

const Ticket = mongoose.model<TicketDock, TicketModel>('Ticket', ticketSchema);

export { Ticket };
