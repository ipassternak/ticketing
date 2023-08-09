import { Error } from 'mongoose';
import { CustomError } from '../errors/custom-error';

export type ErrorHandler = (err: any) => {
  errors: { message: string; field?: string }[];
  statusCode: number;
};

export type Handlers = {
  default: ErrorHandler;
} & {
  [key: string]: ErrorHandler;
};

const validationHandler: ErrorHandler = (err: Error.ValidationError) => {
  const props = Object.keys(err.errors);
  const errors = [];
  for (const prop of props) {
    const { message, path: field } = err.errors[prop];
    errors.push({ message, field });
  }
  return { errors, statusCode: 400 };
};

const customHandler: ErrorHandler = (err: CustomError) => {
  const { message, statusCode } = err;
  return { errors: [{ message }], statusCode };
};

const defaultHandler: ErrorHandler = (err: any) => {
  console.error('Unhandled error:', err);
  return {
    statusCode: 500,
    errors: [{ message: 'Internal server error' }],
  };
};

export const handlers: Handlers = {
  default: defaultHandler,
  CustomError: customHandler,
  ValidationError: validationHandler,
};
