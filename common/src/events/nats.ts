import {
  connect,
  Message,
  Stan,
  SubscriptionOptions,
} from 'node-nats-streaming';
import { Subjects } from '.';

interface Event {
  subject: Subjects;
  data: any;
}

interface Options {
  ackWait?: number;
  logging?: boolean;
  maxFailedAttempts?: number;
}

class NatsWrapper {
  private client: Promise<Stan>;
  private _resolve!: (value: Stan) => void;
  private _reject!: (err: Error) => void;
  qGroup!: string;
  opt!: SubscriptionOptions;
  logging?: boolean;
  maxFailedAttempts!: number;

  constructor() {
    this.client = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  connect(
    clusterId: string,
    clientId: string,
    url: string,
    qGroup: string,
    opt?: Options
  ): Promise<void> {
    const client = connect(clusterId, clientId, { url });
    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        this.qGroup = qGroup;
        this.opt = client
          .subscriptionOptions()
          .setManualAckMode(true)
          .setAckWait(opt?.ackWait || 5000)
          .setDeliverAllAvailable()
          .setDurableName(qGroup);
        this.logging = opt?.logging;
        this.maxFailedAttempts = opt?.maxFailedAttempts || 25;
        if (this.logging) console.log('Connected to NATS successfully');
        this._resolve(client);
        resolve();
      });
      client.on('error', (err) => {
        if (opt?.logging) console.log('Failed to connect to NATS');
        this._reject(err);
        reject(err);
      });
    });
  }

  private parseMessage(msg: Message) {
    const payload = msg.getData();
    const json =
      typeof payload === 'string' ? payload : payload.toString('utf8');
    return JSON.parse(json);
  }

  async listen<T extends Event>(
    subject: T['subject'],
    onMessage: (data: T['data'], msg: Message) => Promise<void>
  ) {
    const client = await this.client;
    const { qGroup, opt, logging, maxFailedAttempts } = this;
    const subscription = client.subscribe(subject, qGroup, opt);
    let failedAttempts = 0;
    subscription.on('message', async (msg: Message) => {
      if (logging) console.log(`Received new ${subject} event`);
      try {
        const data = this.parseMessage(msg);
        await onMessage(data, msg);
        failedAttempts = 0;
      } catch (err) {
        failedAttempts++;
        console.error(
          `[${failedAttempts}/${maxFailedAttempts}] Failed to process ${subject} event:`,
          err
        );
        if (failedAttempts >= maxFailedAttempts)
          throw new Error(
            `Exceeded maximum failed attempts in ${subject} listener`
          );
      }
    });
  }

  async publish<T extends Event>(
    subject: T['subject'],
    data: T['data']
  ): Promise<void> {
    const client = await this.client;
    const payload = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      client.publish(subject, payload, (err) => {
        if (err) return reject(err);
        if (this.logging) console.log(`Published new ${subject} event`);
        resolve();
      });
    });
  }

  async close() {
    const client = await this.client;
    client.close();
    if (this.logging) console.log('NATS connection was closed');
  }
}

export const nats = new NatsWrapper();
