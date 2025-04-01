'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { getStatus } from '@/app/utils/getStatus';
import Link from 'next/link';

const StatusBanner = () => {
  const [status, setStatus] = useState('');
  const [width, setWidth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateWidth = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      setWidth(window.innerWidth - scrollbarWidth);
    };

    const updateStatus = () => {
      setStatus(getStatus());
    };

    updateWidth();
    updateStatus();

    const resizeListener = () => updateWidth();
    window.addEventListener('resize', resizeListener);

    const interval = setInterval(updateStatus, 60000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  const handleNavigation = (e) => {
    e.preventDefault();
    router.push('/');
    setTimeout(() => {
      const section = document.getElementById('store-info');
      if (section) {
        const headerOffset = 140;
        const elementPosition = section.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <div 
      className={`fixed z-50 top-0 left-0 h-[70px] md:h-[40px] w-full p-2 ${status.includes("CLOSED") ? "bg-red" : "bg-darkgreen"}`}
    >
      <div className="text-white font-[500] text-center md:grid md:grid-cols-[20vw_1fr_20vw]" style={{ width: `${width}px` }} >
        <Link
          href="/"
          onClick={handleNavigation}
          className='hidden md:block md:text-start md:ml-8 md:col-start-1 hover:underline'
        >
          Open Hours
        </Link>
        <h1 className='md:col-start-2'>{status}</h1>
        <div className='flex flex-row justify-center gap-2 md:col-start-3'>
          <Link
            href="/"
            onClick={handleNavigation}
            className='md:hidden md:col-start-1 hover:underline'
          >
            Open Hours
          </Link>
          <p className='md:hidden'>•</p>
          <Link href="tel:+13156377778">
            <p className='md:col-start-3 hover:underline md:text-end md:mr-8'>(315) 637-7778</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;