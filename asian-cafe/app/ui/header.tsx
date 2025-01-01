import ACLogo from './ac-logo';
import NavLinks from './navlinks';

export default function Header() {
  return (
    <div className="flex flex-col gap-4 row-start-1 items-center justify-center">
      <ACLogo width={100} />
      <NavLinks />
    </div>
  );
}