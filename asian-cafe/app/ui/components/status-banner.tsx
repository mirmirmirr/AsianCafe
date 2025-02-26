'use client'

import { useEffect, useState } from 'react';
import { getStatus } from '@/app/utils/getStatus';

const StatusBanner = () => {
  const [status, setStatus] = useState('');
  const [width, setWidth] = useState(0);

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

  return (
    <div 
      className={`fixed z-50 top-0 left-0 h-[70px] md:h-[40px] w-full p-2 ${status.includes("CLOSED") ? "bg-red" : "bg-darkgreen"}`}
    >
      <div className="md:grid md:grid-cols-[20vw_1fr_20vw]" style={{ width: `${width}px` }} >
        <h1 className='text-white font-[500] text-center md:col-start-2'>{status}</h1>
        <p className='text-white font-[500] text-center md:col-start-3'>(315) 637-7778</p>
      </div>
    </div>
  );
};

export default StatusBanner;