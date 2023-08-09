import { useRouter } from 'next/router';
import useRequest from '../../../hooks/useRequest';
import { useEffect } from 'react';

export default function Signout() {
  const router = useRouter();
  const [errors, doRequest] = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    onSuccess: () => router.push('/'),
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out...</div>;
}
