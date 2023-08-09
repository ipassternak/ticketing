import { useState } from 'react';
import useRequest from '../../../hooks/useRequest';
import { useRouter } from 'next/router';

export default function CreateTicket() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };
  const [errors, doRequest] = useRequest({
    url: '/api/tickets',
    method: 'POST',
    body: { title, price },
    onSuccess: () => router.push('/'),
  });
  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={doRequest}>
        <div className='form-group'>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            className='form-control'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
        {errors}
      </form>
    </div>
  );
}
