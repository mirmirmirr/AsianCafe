'use client'

import { useEffect, useState } from 'react';
import { getStatus } from '@/app/utils/getStatus';

const StatusBanner = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <div className={`fixed z-50 top-0 left-0 h-[70px] md:h-[40px] w-full p-2 grid grid-row-[1fr_1fr] md:grid-cols-[20vw_1fr_20vw] ${status.includes("CLOSED") ? "bg-red" : "bg-darkgreen"}`}>
      <h1 className='text-white font-[500] text-center md:col-start-2 row-start-1'>{status}</h1>
      <p className='text-white font-[500] md:col-start-3 text-center row-start-2'>(315) 637-7778</p>
    </div>
  );
};

export default StatusBanner;