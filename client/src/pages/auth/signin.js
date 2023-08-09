import { useState } from 'react';
import useRequest from '../../../hooks/useRequest';
import { useRouter } from 'next/router';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, doRequest] = useRequest({
    url: '/api/users/signin',
    method: 'POST',
    body: { email, password },
    onSuccess: () => router.push('/'),
  });
  return (
    <form onSubmit={doRequest}>
      <h1>Sign in</h1>
      <div>
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
        />
      </div>
      <div>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign In</button>
    </form>
  );
}
