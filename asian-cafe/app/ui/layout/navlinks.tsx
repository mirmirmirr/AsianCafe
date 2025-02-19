import Link from 'next/link';
// import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  // { name: 'My Account', href: '/account' },
  // { name: 'Coupons', href: '/coupons' },
]

export default function NavLinks() {
  return (
    <div className='flex flex-row gap-8'>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className='hover:font-[600]'
        >
          <p>{link.name}</p>
        </Link>
      ))}
    </div>
  );
}