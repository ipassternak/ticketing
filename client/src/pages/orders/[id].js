import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../../hooks/useRequest';
import { useRouter } from 'next/router';

export default function DisplayOrder({ order, user }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [errors, doRequest] = useRequest({
    url: '/api/payments',
    method: 'POST',
    body: { orderId: order.id },
    onSuccess: () => router.push('/orders'),
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const expiresAtMs = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(expiresAtMs / 1000));
    };
    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [order]);
  if (timeLeft <= 0) {
    return (
      <div>
        <h1>Purchasing {order.ticket.title}</h1>
        <h4>Your order expired</h4>
      </div>
    );
  }
  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <h4>You have {timeLeft} seconds left to pay for order</h4>
      <StripeCheckout
        token={({ id }) => {
          doRequest(null, { token: id });
        }}
        stripeKey='pk_test_51NPnPRGUzfLf8x9WCicqji93UXZkxvn4FCJvq2z23y43MsV5kaH1vIzF8qebLOh6Q1Zmj850AFW0n4ByONewy96R00CFfOp14h'
        amount={order.ticket.price * 100}
        email={user.email}
      />
      {errors}
    </div>
  );
}

DisplayOrder.getInitialProps = async (ctx, customFetch) => {
  const { id } = ctx.query;
  const res = await customFetch(`/api/orders/${id}`);
  const order = await res.json();
  return { order };
};
