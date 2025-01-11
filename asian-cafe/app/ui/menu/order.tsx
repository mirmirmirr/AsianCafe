'use client'
import OrderSummary from '@/app/ui/menu/order-summary';
import { useState } from 'react';

export default function Order({ setOrderQuantity }) {
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <>
      <h1 className='text-[20px] font-[600]'>My Order</h1>
      <OrderSummary setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />
      <div className='flex justify-center mt-4'>
        <button className='bg-darkgreen rounded-[20px] w-[330px] p-2 font-bold'>
          Place Order ${totalPrice.toFixed(2)}
        </button>
      </div>
    </>
  )
}