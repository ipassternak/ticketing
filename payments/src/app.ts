import express, { Request } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  authenticate,
  errorHandler,
  CustomError,
  errorHandlers,
} from '@ipassternak-gittix/common-lib';
import { paymentsRouter } from './routes/payments';

const app = express();

app.use(json());
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(authenticate);

app.use(paymentsRouter);

app.all('*', (req: Request) => {
  const { originalUrl } = req;
  throw new CustomError(`Invalid route: ${originalUrl}`, 404);
});
app.use(errorHandler);

export { app };
