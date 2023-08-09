import Queue from 'bull';
import {
  nats,
  ExpirationCompletedEvent,
  Subjects,
} from '@ipassternak-gittix/common-lib';

interface Payload {
  orderId: string;
}

const queue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env!.REDIS_HOST,
  },
});

queue.process(async (job) => {
  const { orderId } = job.data;
  await nats.publish<ExpirationCompletedEvent>(Subjects.ExpirationCompleted, {
    orderId,
  });
});

export { queue as expirationQueue };
