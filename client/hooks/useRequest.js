import { useState } from 'react';

const formatErrors = (data) => (
  <div className='alert alert-danger'>
    <h4>Oopps...</h4>
    <ul className='my-0'>
      {data.map((err, i) => (
        <li key={i}>{err.message}</li>
      ))}
    </ul>
  </div>
);

export default function useRequest({
  url,
  method = 'GET',
  body = {},
  onSuccess = () => {},
}) {
  const [errors, setErrors] = useState(null);
  const doRequest = async (e, payload = {}) => {
    e?.preventDefault();
    setErrors(null);
    try {
      const init = { method };
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify({ ...body, ...payload });
      const res = await fetch(url, method === 'GET' ? {} : init);
      const data = res.status !== 204 ? await res.json() : null;
      if (!res.ok) {
        const foramtedErrors = formatErrors(data);
        setErrors(foramtedErrors);
      } else {
        onSuccess(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return [errors, doRequest];
}
