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
      <div className="md:grid md:grid-cols-[20vw_1fr_20vw]" style={{ width: `${width}px` }} >
        <a
          href="/"
          onClick={handleNavigation}
          className='text-white font-[500] text-center md:col-start-1 hover:underline cursor-pointer'
        >
          Open Hours
        </a>
        <h1 className='text-white font-[500] text-center md:col-start-2'>{status}</h1>
        <Link href="tel:+13156377778">
          <p className='text-white font-[500] text-center md:col-start-3 hover:underline'>(315) 637-7778</p>
        </Link>
      </div>
    </div>
  );
};

export default StatusBanner;