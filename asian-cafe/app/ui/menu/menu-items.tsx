"use client";
import { useState } from "react";
import OrderForm from "./order-form";

export function SectionMobile({ section }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='mt-4'>
      <div className="flex flex-row justify-between">
        <p className='text-[20px] font-[600]'>{section.section}</p>

        <button 
          onClick={toggleDropdown} 
          className='bg-darkgreen text-white p-2 rounded'>
          {isDropdownOpen ? 'Hide Menu' : 'Show Menu'}
        </button>
      </div>

      { isDropdownOpen && (
        <>
          {section.desc && (<p className="mb-2 italic">{ section.desc }</p>)}
          {section.subsections.length > 0 ? (
            section.subsections.map((subsection, index) => (
              <SubSection key={index} subsection={subsection} />
            ))
          ) : (
            <MenuItems items={section.menu_items} />
          )}
        </>
      )}
    </div>
  );
}

export function Section({ section }) {
  return (
    <div className='mt-4'>
      <h2 className='text-[20px] font-[600]'>{section.section}</h2>
      {section.desc && (<p className="mb-2 italic">{ section.desc }</p>)}

      { section.subsections.length > 0 ? (
        section.subsections.map((subsection, index) => (
          <SubSection key={index} subsection={subsection} />
        ))
      ) : (
        <MenuItems items={section.menu_items} />
      )}
    </div>
  );
}

function SubSection({ subsection }) {
  return (
    <div className="">
      <h3 className='text-[18px] font-[500] mt-4'>{subsection.subsection}</h3>
      {subsection.desc && <p className="mb-2 italic">{subsection.desc}</p>}
      <MenuItems items={subsection.menu_items} />
    </div>
  )
}

function MenuItems({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => handleButtonClick(item)}
          className='flex flex-row gap-8 p-1 justify-between hover:bg-darkgreen'
        >
          <div className='flex flex-row gap-2 -ml-[20px]'>
            <div className="w-[20px] h-[20px]">
              {item.spicy ? (
                <img src="/chili.svg" alt="spicy dish" width={20} height={20} />
              ) : null}
            </div>
            <p className='w-[30px]'>{item.code}.</p>
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
    </>
  )
}