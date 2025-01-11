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
    <div className={`fixed z-50 top-0 left-0 h-[40px] w-full p-2 grid grid-cols-[200px_1fr_200px] ${status.includes("CLOSED") ? "bg-red" : "bg-darkgreen"}`}>
      <h1 className='text-white font-[500] text-center col-start-2'>{status}</h1>
      <p className='text-white font-[500] col-start-3 text-center'>(315) 637-7778</p>
    </div>
  );
};

export default StatusBanner;