'use client'

import { useState, useEffect } from 'react';
import api from '@/app/lib/axios';
import { useOrder } from '@/app/ui/menu/OrderContext';
import { OrderSummaryList } from '../order-summary';
import Confirmation from './order-confirmation';
import OrderDetailsForm from './order-details-form';
import OrderPriceSummary from './order-price-summary';

export default function OrderConfirm({ onClose }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    pickupTime: "ASAP",
    pickupOption: "ASAP",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [errors, setErrors] = useState({ time: '', name: '', phone: '' });
  const { orderUpdated, updateOrder } = useOrder();

  const updateOrderDetails = (key, value) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, [key]: value }));
    if (key === 'name' && value === '') {
      setErrors(prevErrors => ({ ...prevErrors, name: 'Please enter a name for the order' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, name: '' }));
    }

    if (key === 'phone' && value === '') {
      setErrors(prevErrors => ({ ...prevErrors, phone: 'Please enter a phone number for the order' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, phone: '' }));
    }

    if (key === 'pickupTime' && value === '') {
      setErrors(prevErrors => ({ ...prevErrors, time: 'Please choose a pickup time' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, time: '' }));
    }
  }

  useEffect(() => {
    if (orderDetails.pickupOption === 'Schedule') {
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 20);
      const localTime = new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000);
      const defaultTime = localTime.toISOString().substring(11, 16);
      updateOrderDetails('pickupTime', defaultTime);
    }
  }, [orderDetails.pickupOption]);

  const handlePlaceOrder = async () => {
    if (orderDetails.name && orderDetails.phone && orderDetails.pickupTime) {
      const { pickupTime, pickupOption } = orderDetails;
      const formattedTime = formatPickupTime(pickupOption, pickupTime);
      updateOrderDetails('pickupTime', formattedTime);
      setOrderPlaced(true);

      try {
        const response = await api.patch('/api/checkout');
        console.log(response.data);
        updateOrder();
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    } else {
      setErrors({
        time: orderDetails.pickupTime ? '' : 'Please choose a pickup time',
        name: orderDetails.name ? '' : 'Please enter a name for the order',
        phone: orderDetails.phone ? '' : 'Please enter a phone number for the order',
      });
    }
  };

  const formatPickupTime = (option, time) => {
    if (option === 'ASAP') {
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 20);
      return formatTime(currentTime);
    }
    return formatTime(time);
  };
  
  const formatTime = (time) => {
    let hour, minutes;
  
    if (typeof time === 'string') {
      hour = parseInt(time.substring(0, 2), 10);
      minutes = time.substring(3, 5);
    } else {
      hour = time.getHours();
      minutes = time.getMinutes().toString().padStart(2, '0');
    }
  
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
  
    return `${hour}:${minutes} ${ampm}`;
  };

  if (orderPlaced) {
    const { pickupTime, name, phone } = orderDetails;    
    return (
      <OrderSheetWrapper onClose={() => { onClose(); setOrderPlaced(false); }}>
        <Confirmation
          pickupTime={pickupTime}
          name={name}
          phone={phone}
          orderQuantity={orderQuantity}
          totalPrice={totalPrice}
        />
      </OrderSheetWrapper>
    );
  }

  return (
    <OrderSheetWrapper onClose={onClose}>
      <OrderDetailsForm orderDetails={orderDetails} updateOrderDetails={updateOrderDetails} errors={errors} setErrors={setErrors} />

      <div className="flex flex-col flex-1 justify-between min-h-fit gap-4">
        <OrderSummaryList setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />
        <OrderPriceSummary totalPrice={totalPrice} />
      </div>

      <div className="fixed bottom-8 left-0 right-0 px-8">
        <button
          className="z-50 bg-darkgreen text-white w-full p-2 rounded-[20px] shadow-[0_10px_60px_0px_rgba(0,0,0,0.3)]"
          onClick={handlePlaceOrder}
        >
          Place Order ${(totalPrice * 1.08).toFixed(2)}
        </button>
      </div>
    </OrderSheetWrapper>
  );
}

function OrderSheetWrapper({ children, onClose }) {
  return (
    <div className='fixed flex flex-col top-0 right-0 h-full w-full max-w-screen md:w-[390px] bg-white relative p-8 pt-0 overflow-y-auto'>
      <div className='md:hidden block flex gap-5 items-center bg-white sticky top-0 pt-8'>
        <button className="mb-4" onClick={() => { onClose(); document.body.style.overflow = 'auto'; }}>
          <img src="/icons/cross.svg" alt="close" width={25} height={25} />
        </button>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      </div>

      <div className='hidden md:block items-center bg-white sticky top-0 pt-8'>
        <button className="pb-4" onClick={() => { onClose(); document.body.style.overflow = 'auto'; }}>
          <img src="/icons/cross.svg" alt="close" width={30} height={30} />
        </button>
        <h2 className="text-xl font-bold mb-4 sticky top-[30px]">Order Summary</h2>
      </div>

      {children}
    </div>
  );
}