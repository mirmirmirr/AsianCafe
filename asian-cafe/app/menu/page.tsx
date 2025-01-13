'use client'

import { Section, SectionMobile } from "../ui/menu/menu-items";
import api from '@/app/lib/axios';
import Order from '@/app/ui/menu/order';
import CategoryLinks from '../ui/menu/category-links';
import { useEffect, useState } from 'react';
import OrderConfirm from "../ui/menu/order-confirm";

export default function Page() {
  const [sections, setSections] = useState([]);
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(0);

  useEffect(() => {
    if (isOrderVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOrderVisible]);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await api.get('/api/menu');
      const data = response.data;
      setSections(data['menu']);
    };

    fetchMenu();
  }, []);
  
  return (
    <div className="grid grid-rows-[240px_1fr] min-h-screen gap-8">
      <main className="row-start-2 md:grid md:grid-cols-[1fr_350px] lg:grid-cols-[300px_1fr_350px] gap-x-8">
        <CategoryLinks sections={sections} />
        <div className='md:col-start-1 lg:col-start-2'>
          {sections.map((category, index) => (
            <div
              key={index}
              id={category.id}
            >
              <div className='hidden md:block'> <Section section={category}/> </div>
              <div className='md:hidden'> <SectionMobile section={category} /> </div>
            </div>
          ))}
        </div>
        <div className='hidden md:block border-l-2 border-black p-4 pr-0 col-start-2 lg:col-start-3'>
          <div className='sticky top-[140px]'>
            <Order setOrderQuantity={setOrderQuantity} />
          </div>
        </div>
      </main>

      <button
        onClick={() => setIsOrderVisible(!isOrderVisible)}
        className='md:hidden fixed flex items-center gap-2 bottom-4 right-4 bg-darkgreen text-black p-4 rounded-full shadow-lg z-50'
      >
        <img src="/icons/shop-bag.svg" alt="selected option" width={30} height={30} />
        {orderQuantity > 0 && <span>{orderQuantity}</span> }
      </button>
      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          isOrderVisible ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <OrderConfirm           
          orderData={""}
          onClose={() => setIsOrderVisible(false)}
        />
      </div>

    </div>
  );
}