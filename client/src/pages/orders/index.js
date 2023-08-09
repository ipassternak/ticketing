export default function Orders({ orders }) {
  const list = orders.map((order, i) => {
    return (
      <tr key={i}>
        <td>{order.ticket.title}</td>
        <td>{order.status}</td>
      </tr>
    );
  });
  return (
    <div>
      <h1>My Orders</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Ticket Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>
    </div>
  );
}

Orders.getInitialProps = async (ctx, customFetch) => {
  const res = await customFetch('/api/orders');
  const orders = await res.json();
  return { orders };
};
