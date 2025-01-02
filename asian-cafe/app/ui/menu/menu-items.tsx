"use client";
import { useState } from "react";
import OrderForm from "./order-form";

export function MenuItems({ sectionName, allItems }) {
  const sectionItems = allItems.filter(item => item.section === sectionName);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className='mt-4'>
      <p className='text-[20px] font-[600]'>{sectionName}</p>
      {sectionItems.map((item) => (
        <div
          key={item.id}
          onClick={() => handleButtonClick(item)}
          className='flex flex-row gap-8 p-1 justify-between hover:bg-darkgreen'
        >
          <div className='flex flex-row gap-2 -ml-[20px]'>
            <div className="w-[20px] h-[20px]">
              {item.spicy ? (
                <img src="/chili.svg" alt="spicy dish" width={20} height={20} />
              ) : null}
            </div>
            <p className='w-[30px]'>{item.sectionid}.</p>
            <p>{item.name}</p>
          </div>

          <div className='flex flex-row gap-2'>
            <p>{parseFloat(item.price).toFixed(2)}</p>
            <button
              onClick={() => handleButtonClick(item)}
              className="hidden md:block font-[600] hover:text-red"
            >
              Order
            </button>
          </div>
        </div>
      ))}

      {selectedItem && (
        <OrderForm selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      )}
    </div>
  );
}

export function MenuItemsDropDown({ sectionName, allItems }) {
  const sectionItems = allItems.filter(item => item.section === sectionName);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleButtonClick = (item) => {
    setSelectedItem(item);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className='mt-4'>
      <div className="flex flex-row justify-between">
        <p className='text-[20px] font-[600]'>{sectionName}</p>
        <button 
          onClick={toggleDropdown} 
          className='bg-darkgreen text-white p-2 rounded'>
          {isDropdownOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
      </div>

        {isDropdownOpen && (
          <div className='mt-2'>
            {sectionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleButtonClick(item)}
                className='flex flex-row gap-8 p-1 justify-between hover:bg-darkgreen'
              >
                <div className='flex flex-row gap-2 -ml-[20px]'>
                  <div className="w-[20px] h-[20px]">
                    {item.spicy ? (
                      <img src="/chili.svg" alt="spicy dish" width={20} height={20} />
                    ) : null}
                  </div>
                  <p className='w-[30px]'>{item.sectionid}.</p>
                  <p>{item.name}</p>
                </div>

                <div className='flex flex-row gap-2'>
                  <p>{parseFloat(item.price).toFixed(2)}</p>
                  <button
                    onClick={() => handleButtonClick(item)}
                    className="font-[600] hover:text-red"
                  >
                    Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {selectedItem && (
        <OrderForm selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      )}
    </div>
  );
}