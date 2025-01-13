import Image from 'next/image';
import { geistSans } from '@/app/ui/fonts';

export function ACLogoHorizontal({ width }) {
  return (
    <div
      className={`flex flex-col items-center leading-non w-[400px]`}
    >
      <img
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

export function ACLogoVertical({ width }) {
  return (
    <div
      className={`flex flex-row items-center leading-none`}
    >
      <img
        src="/AsianCafeLogo.png"
        alt="Asian Cafe Logo"
        width={width}
        height={0}
        style={{ height: 'auto' }}
      />
    </div>
  );
}