import Image from 'next/image';
import { geistSans } from '@/app/ui/fonts';

export default function ACLogo({width}) {
  return (
    <div
      className={`flex flex-col items-center leading-none`}
    >
      <img
        className="dark:invert"
        src="/AsianCafeLogo.png"
        alt="Asian Cafe Logo"
        width={width}
        height={0}
        style={{ height: 'auto' }}
      />
      <p className={`text-[40px] text-red font-[700]`}>Asian Cafe</p>
    </div>
  );
}