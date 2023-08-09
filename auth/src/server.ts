import mongoose from 'mongoose';
import { checkEnv } from '@ipassternak-gittix/common-lib';
import { app } from './app';

const ENV = ['JWT_SECRET', 'MONGO_URI', 'PORT'];

checkEnv(...ENV);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to database successfully');
  const port = parseInt(process.env.PORT!);
  app.listen(port, () => {
    console.log(`Listenning on port: ${port}`);
  });
};

start();

['SIGINT', 'SIGTERM'].forEach((sig) =>
  process.on(sig, async () => {
    await mongoose.connection.close();
    console.log('Database connection was closed');
    process.exit(0);
  })
);
