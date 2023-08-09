import { OrderStatus } from '../types/order-status';

export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',
  ExpirationCompleted = 'expiration:completed',
  PaymentCompleted = 'payment:completed',
}

interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: Ticket;
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: Ticket;
}

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    expiresAt: string;
    version: number;
    status: OrderStatus;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}

export interface ExpirationCompletedEvent {
  subject: Subjects.ExpirationCompleted;
  data: {
    orderId: string;
  };
}

export interface PaymentCompletedEvent {
  subject: Subjects.PaymentCompleted;
  data: {
    id: string;
    orderId: string;
    chargeId: string;
  };
}
