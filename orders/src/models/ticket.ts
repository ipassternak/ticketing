import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  _id: string;
  price: number;
  title: string;
}

export interface TicketDoc extends mongoose.Document {
  price: number;
  title: string;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  createOne(attrs: TicketAttrs): TicketDoc;
  findCurrent(data: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: [true, 'The price is required field'],
      min: [0.001, 'The price must be grater than 0'],
    },
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
ticketSchema.statics.findCurrent = (data: { id: string; version: number }) =>
  Ticket.findOne({ _id: data.id, version: data.version - 1 });

ticketSchema.methods.isReserved = async function () {
  const ticketIsReserved = await Order.exists({
    ticket: this,
    status: { $ne: OrderStatus.Cancelled },
  });
  return !!ticketIsReserved;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
