'use client';

import { useState } from 'react';

interface RadioCards {
  options: { id: number; name: string; price: number; get_quantity: boolean}[];
  selected: string;
  onChange: (value: string) => void;
}

export default function RadioCards({ options, selected, onChange }: RadioCards) {
  const [selectedValue, setSelectedValue] = useState(selected);

  const handleSelect = (value) => {
    setSelectedValue(value.name);
    onChange(value);
  };

  return (
    <div className="flex flex-wrap mb-2 overflow-hidden gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option)}
          className={`w-[175px] p-2 rounded-md text-center text-sm transition-colors duration-200 ${
            selectedValue === option.name
              ? 'bg-lightgreen text-black'
              : 'border-2 border-[#DEEBD1] text-[#7D7D7D] hover:bg-[#DEEBD1]'
          }`}
        >
          {option.name} { option.price === 0 ? "" : `($${parseFloat(option.price.toString()).toFixed(2)})` }
        </button>
      ))}
    </div>
  );
}