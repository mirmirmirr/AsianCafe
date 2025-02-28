'use client'
import OrderSummary from '@/app/ui/menu/order-summary';
import OrderConfirm from '@/app/ui/menu/order-confirm/order-confirm';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';

export default function Order({ setOrderQuantity }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isConfirmingOrder) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      setAnimateIn(true);

    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '';
      
      // setAnimateIn(false);
    }
  }, [isConfirmingOrder]);

  const closeOrder = () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '';

    setTimeout(() => setIsConfirmingOrder(false), 200);
    setAnimateIn(false);
  };

  return (
    <>
      <p className='mb-2'>*Click on item to edit</p>
      <h1 className='text-[30px] font-[600] font-euphoria'>My Order</h1>
      <OrderSummary setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />
      <div className="sticky bottom-8">
        <button 
          onClick={() => setIsConfirmingOrder(true)} 
          className="z-50 bg-darkgreen text-white w-[330px] p-2 rounded-[20px] shadow-lg"
        >
          Checkout ${(totalPrice * 1.08).toFixed(2)}
        </button>
      </div>

      {isConfirmingOrder &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50">
            <div 
              className={`
                absolute inset-0 bg-black bg-opacity-50 
                transition-opacity duration-300
                ${animateIn ? 'opacity-100' : 'opacity-0'}
              `}
              onClick={closeOrder}
            />

            <div
              className={`
                absolute right-0 top-0 h-full w-[390px] bg-white 
                transition-transform ease-in-out duration-300
                ${animateIn ? 'translate-x-0' : 'translate-x-full'}
              `}
            >
              <OrderConfirm onClose={closeOrder} />
            </div>
          </div>,
          document.body
    )}
    </>
  );
}
