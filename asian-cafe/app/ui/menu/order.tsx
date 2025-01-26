'use client'
import OrderSummary from '@/app/ui/menu/order-summary';
import OrderConfirm from '@/app/ui/menu/order-confirm';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';

export default function Order({ setOrderQuantity }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  useEffect(() => {
    if (isConfirmingOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isConfirmingOrder]);

  return (
    <>
      <p className='mb-2'>*Click on item to edit</p>
      <h1 className='text-[30px] font-[600] font-euphoria'>My Order</h1>
      <OrderSummary setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />
      <div className='flex justify-center mt-4'>
        <button onClick={() => setIsConfirmingOrder(true)} className='bg-darkgreen rounded-[20px] w-[330px] p-2 font-bold'>
          Checkout ${totalPrice.toFixed(2)}
        </button>
      </div>

      {isConfirmingOrder && ReactDOM.createPortal(
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transform ${
            isConfirmingOrder ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out`}
        >
          <OrderConfirm           
            orderData={""}
            onClose={() => setIsConfirmingOrder(false)}
          />
        </div>,
        document.body
      )}
    </>
  )
}