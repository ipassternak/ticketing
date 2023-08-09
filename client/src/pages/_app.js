import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import prepareFetch from '../../api/prepareFetch';
import Header from '../../components/header';

export default function AppComponent({ Component, pageProps, user }) {
  return (
    <div>
      <Header user={user} />
      <div className='container'>
        <Component user={user} {...pageProps} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const customFetch = prepareFetch(ctx.req);
  try {
    const res = await customFetch('/api/users/current-user');
    const user = await res.json();
    const { getInitialProps: getProps } = Component;
    const pageProps = getProps ? await getProps(ctx, customFetch, user) : null;
    return { pageProps, user };
  } catch (err) {
    console.error(err);
  }
};
