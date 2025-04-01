import Link from 'next/link';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
]

export default function NavLinks() {
  return (
    <div className='flex flex-row gap-8'>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className='hover:font-[600] text-lg'
        >
          <p>{link.name}</p>
        </Link>
      ))}
    </div>
  );
}