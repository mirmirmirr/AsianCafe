import Image from 'next/image';
import ACLogo from './ui/ac-logo';
import NavLinks from './ui/navlinks';
import Header from './ui/header';

export default function Home() {
  return (
    <div className="grid grid-rows-[200px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-1 items-center justify-center">
        homepage
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>&#169; 2018 Asian Cafe Asian Restaurant</p>
      </footer>
    </div>
  );
}
