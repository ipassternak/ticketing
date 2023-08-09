import { checkEnv, nats } from '@ipassternak-gittix/common-lib';
import './events/listeners/orders';

const ENV = [
  'NATS_CLUSTER_ID',
  'NATS_CLIENT_ID',
  'NATS_URL',
  'QGROUP',
  'REDIS_HOST',
];

checkEnv(...ENV);

const start = async () => {
  await nats.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!,
    process.env.QGROUP!,
    { logging: true }
  );
};

start();

['SIGINT', 'SIGTERM'].forEach((sig) =>
  process.on(sig, async () => {
    await nats.close();
    process.exit(0);
  })
);
