import mongoose from 'mongoose';
import { nats, checkEnv } from '@ipassternak-gittix/common-lib';
import { app } from './app';
import './events/listeners/orders';

const ENV = [
  'JWT_SECRET',
  'MONGO_URI',
  'NATS_CLUSTER_ID',
  'NATS_CLIENT_ID',
  'NATS_URL',
  'QGROUP',
  'PORT',
];

checkEnv(...ENV);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to database successfully');
  await nats.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!,
    process.env.QGROUP!,
    { logging: true }
  );
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
    await nats.close();
    process.exit(0);
  })
);
