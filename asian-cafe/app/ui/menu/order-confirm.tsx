'use client'

import { createContext, useContext, useState, ReactNode, useEffect, use } from 'react';
import { OrderSummaryList } from './order-summary';


export default function OrderConfirm({ orderData, onClose }) {
  const [pickupTime, setPickupTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupOption, setPickupOption] = useState('ASAP');

  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(0);

  const openingHours = {
    'Sunday': [],
    'Monday': [],
    'Tuesday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Wednesday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Thursday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Friday': [{ start: '11:00', end: '14:00' }, { start: '16:00', end: '20:00' }],
    'Saturday': [{ start: '16:00', end: '20:00' }],
  };

  const isWithinOpeningHours = (date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date.toTimeString().substring(0, 5);
    const hours = openingHours[day];
    return hours.some(({ start, end }) => time >= start && time <= end);
  };

  useEffect(() => {
    // Prevent body scrolling when OrderConfirm is visible
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable body scrolling when OrderConfirm is closed
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (pickupOption === 'Schedule') {
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 20);
      const localTime = new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000);
      const defaultTime = localTime.toISOString().substring(11, 16);
      setPickupTime(defaultTime);
    }
  }, [pickupOption]);

  const handlePlaceOrder = () => {
    console.log("Order placed:", {
      pickupTime,
      name,
      phone,
    });

    onClose();
  };

  return (
    <div className='fixed top-0 right-0 h-full w-[390px] bg-white'>
      <div className="relative w-full max-w-lg h-full overflow-y-auto bg-white p-8">
      <button
        className="mb-4"
        onClick={() => onClose()}
      >
        <img src="/icons/cross.svg" alt="selected option" width={30} height={30} />
      </button>
      <div>
        <h2 className="text-xl font-bold mb-4">My Order</h2>
        {/* <div className="mb-4">
          <h3 className="font-semibold">Pick Up From</h3>
          <p>511 E Genesee Street</p>
          <p>Fayetteville, NY 13066</p>
        </div> */}
        <form className="mb-4">
        <div className="mb-2">
              <label className="block text-sm font-medium">Pick Up Time</label>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="asap"
                  name="pickupOption"
                  value="ASAP"
                  checked={pickupOption === 'ASAP'}
                  onChange={() => setPickupOption('ASAP')}
                  className="mr-2"
                />
                <label htmlFor="asap" className="mr-4">ASAP</label>
                <input
                  type="radio"
                  id="schedule"
                  name="pickupOption"
                  value="Schedule"
                  checked={pickupOption === 'Schedule'}
                  onChange={() => setPickupOption('Schedule')}
                  className="mr-2"
                />
                <label htmlFor="schedule">Schedule Time</label>
              </div>
              {pickupOption === 'Schedule' && (
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              )}
            </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </form>
        <OrderSummaryList setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />
        <div className='flex flex-row mt-4 justify-between mb-[70px]'>
          <h3 className="block text-md font-medium">Summary</h3>
          <div>
            <div className='grid grid-cols-2 gap-2 border-b-2 w-[175px]'>
              <div>
                <p className="text-md">SubTotal</p>
                <p className="text-md">Tax</p>
              </div>
              <div>
                <p className="text-md text-right">${totalPrice.toFixed(2)}</p>
                <p className="text-md text-right">${(totalPrice * 0.08).toFixed(2)}</p>
              </div>
            </div>
            <div className='flex flex-row justify-between mt-2'>
              <h3 className="text-md font-bold">Total</h3>
              <p className="text-md font-bold">${(totalPrice * 1.08).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white h-[90px] flex items-center justify-center fixed bottom-0 z-50'>
        <button
          className="bg-darkgreen text-white w-[330px] p-2 rounded-[20px]"
          onClick={handlePlaceOrder}
        >
          Place Order ${(totalPrice * 1.08).toFixed(2)} 
        </button>
      </div>

      </div>
    </div>
  )
}