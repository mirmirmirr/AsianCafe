'use client'

import { useState, useEffect } from 'react';
import { OrderSummaryList } from '../order-summary';
import Confirmation from './order-confirmation';
import OrderConfirmForm from './order-details-form';
import OrderPriceSummary from './order-price-summary';

export default function OrderConfirm({ onClose }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    pickupTime: "",
    pickupOption: "ASAP",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [errors, setErrors] = useState({ time: '', name: '', phone: '' });

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

  const handlePlaceOrder = () => {
    if (orderDetails.name && orderDetails.phone && orderDetails.pickupTime) {
      console.log('Order placed:', orderDetails);
      const { pickupTime, pickupOption } = orderDetails;
      
      const formattedTime = formatPickupTime(pickupOption, pickupTime);

      updateOrderDetails('pickupTime', formattedTime);
      setOrderPlaced(true);
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
    setOrderPlaced(false);
    
    return (
      <OrderSheetWrapper onClose={onClose}>
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
        <h2 className="text-xl font-bold mb-4">My Order</h2>
        <OrderConfirmForm orderDetails={orderDetails} updateOrderDetails={updateOrderDetails} errors={errors} setErrors={setErrors} />
        <OrderSummaryList setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />

        <div className='justify-center fixed bottom-8 z-50'>
          <OrderPriceSummary totalPrice={totalPrice} />
          <button
            className="bg-darkgreen text-white w-[330px] p-2 rounded-[20px]"
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
    <div className='fixed top-0 right-0 h-full w-full md:w-[390px] bg-white'>
      <div className="relative w-full max-w-lg h-full overflow-y-auto bg-white p-8">
        <button className="mb-4" onClick={() => { onClose(); document.body.style.overflow = 'auto'; }}>
          <img src="/icons/cross.svg" alt="close" width={30} height={30} />
        </button>
        {children}
      </div>
    </div>
  );
}