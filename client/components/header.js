import Link from 'next/link';

export default function Header({ user }) {
  const links = (
    user
      ? [
          { label: 'Sell Tickets', href: '/tickets/create' },
          { label: 'My Orders', href: '/orders' },
          { label: 'Sign Out', href: '/auth/signout' },
        ]
      : [
          { label: 'Sign Up', href: '/auth/signup' },
          { label: 'Sign In', href: '/auth/signin' },
        ]
  ).map((link, i) => {
    return (
      <li key={i} className='nav-item'>
        <Link href={link.href} className='nav-link'>
          {link.label}
        </Link>
      </li>
    );
  });
  return (
    <nav className='navbar navbar-ligth bg-light'>
      <Link className='navbar-brand' href='/'>
        GitTix
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  );
}
