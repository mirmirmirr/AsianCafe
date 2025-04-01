'use client';

import { useState } from 'react';

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
  const [selectedValue, setSelectedValue] = useState(selected);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="flex mb-2 border-2 border-[#EBEFE8] rounded-md overflow-hidden">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={`flex-1 p-1 text-center transition-colors duration-200 ${
            selectedValue === option.value
              ? 'bg-white text-black font-[500]'
              : 'bg-[#EBEFE8] text-[#7D7D7D] hover:bg-[#DEEBD1]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}