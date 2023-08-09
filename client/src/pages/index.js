import Link from 'next/link';

export default function Home({ tickets }) {
  const list = tickets.map((ticket, i) => {
    return (
      <tr key={i}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={'/tickets/[id]'} as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>
    </div>
  );
}

Home.getInitialProps = async (ctx, customFetch) => {
  const res = await customFetch('/api/tickets');
  if (!res.ok) return { tickets: [] };
  const tickets = await res.json();
  return { tickets };
};
