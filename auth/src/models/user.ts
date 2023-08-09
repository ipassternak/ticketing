import mongoose from 'mongoose';
import validator from 'validator';
import { hash } from '../utils/password';

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  createOne(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'The email is required field'],
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: () => 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'The password is required field'],
      minLength: [8, 'Password must contain at least 8 characters'],
      maxLength: [20, 'Password should not exceed 20 characters'],
      set: (value: string) => value.trim(),
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await hash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.createOne = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
