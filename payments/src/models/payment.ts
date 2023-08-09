import mongoose from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  chargeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  chargeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  createOne(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    chargeId: {
      type: String,
      required: [true, 'The chargeId is required field'],
    },
    orderId: {
      type: String,
      required: [true, 'The orderId is required field'],
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

paymentSchema.statics.createOne = (attrs: PaymentAttrs) => new Payment(attrs);

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
