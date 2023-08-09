import { useRouter } from 'next/router';
import useRequest from '../../../hooks/useRequest';

export default function DisplayTicket({ ticket }) {
  const router = useRouter();
  const [errors, doRequest] = useRequest({
    url: '/api/orders/',
    method: 'POST',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: ({ id }) => router.push('/orders/[id]', `/orders/${id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button className='btn btn-primary' onClick={doRequest}>
        Purchase
      </button>
      {errors}
    </div>
  );
}

DisplayTicket.getInitialProps = async (ctx, customFetch) => {
  const { id } = ctx.query;
  const res = await customFetch(`/api/tickets/${id}`);
  const ticket = await res.json();
  return { ticket };
};
