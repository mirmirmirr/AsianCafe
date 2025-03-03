'use client'

import api from '@/app/lib/axios';
import { useEffect, useState, useCallback } from 'react';
import QuantityCounter from '../../components/counter';
import RadioCards from '../../components/radio-cards';
import AddButton from '../../components/add-button';

export default function ExtraOptions({ itemCode, selectedExtras, setSelectedExtras, setSelectedExtrasPrice }) {
  const [extras, setExtras] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [dropdownExtras, setDropdownExtras] = useState([]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const { data } = await api.get(`/api/extras/${itemCode}`);
        const allExtras = data?.extras || [];

        const newDropdownExtras = [];
        const filteredExtras = [];

        allExtras.forEach((category) => {
          if (category.options.length > 0 && ["Rice", "Noodle Type", "Broth"].includes(category.category)) {
            newDropdownExtras.push(category);
          } else {
            filteredExtras.push(category);
          }
        });

        setDropdownExtras(newDropdownExtras);
        setExtras(filteredExtras);
      } catch (error) {
        console.error('Error fetching extras:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtras();
  }, [itemCode]);

  if (isLoading && itemCode > 12 && itemCode < 65) {
    return (
      <div className='space-y-2 mb-2 p-8 pt-0 max-h-[60dvh] overflow-y-scroll'>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-200 animate-pulse rounded-md">
            <div className="flex flex-row items-center space-x-4">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div>
                <div className="w-24 h-4 bg-gray-300 rounded-md mb-1"></div>
                <div className="w-16 h-3 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );    
  }

  return (
    <div className='space-y-2 mb-2 p-8 pt-0 max-h-[60dvh] overflow-y-scroll'>
      <div>
        {dropdownExtras.map((category, index) => (
          <div key={index}>
            <h3 className='font-semibold'>{ category.category }</h3>
            <DropDownOptions 
              categoryName={category.category}
              selectedExtras={selectedExtras[category.category]?.chosen_options || []}
              options={category.options}
              setSelectedExtras={setSelectedExtras}
              setSelectedExtrasPrice={setSelectedExtrasPrice}
            />
          </div>
        ))}
      </div>
      
      {extras.map((category, index) => (
        <div key={index}>
          <h3 className='font-semibold'>{ category.category }</h3>
          <RegularOptions 
            categoryName={category.category}
            selectedExtras={selectedExtras[category.category]?.chosen_options || []}
            options={category.options}
            optionIndex={index} 
            setSelectedExtras={setSelectedExtras}
            setSelectedExtrasPrice={setSelectedExtrasPrice}
          />
        </div>
      ))}
    </div>
  );
}

function RegularOptions({ categoryName, selectedExtras, options, optionIndex, setSelectedExtras, setSelectedExtrasPrice }) {
  const [quantities, setQuantities] = useState(
    options.reduce((acc, option) => {
      acc[option.name] = 1;
      return acc;
    }, {})
  );

  const [checkedOptions, setCheckedOptions] = useState(
    options.reduce((acc, option) => {
      acc[option.name] = false;
      return acc;
    }, {})
  )

  useEffect(() => {
    if (selectedExtras.length > 0) {
      selectedExtras.forEach((extra) => {
      setCheckedOptions((prev) => ({
        ...prev,
        [extra.name]: true,
      }));

      setQuantities((prev) => ({
        ...prev,
        [extra.name]: extra.quantity,
      }));
      });
    }
  }, [selectedExtras, categoryName]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    const addonName = e.target.name;
    const price = parseFloat(e.target.value);
    const quantity = quantities[e.target.name];

    setCheckedOptions((prev) => ({
      ...prev,
      [e.target.name]: isChecked,
    }));

    setSelectedExtras((prev) => {
      const updatedExtras = { ...prev };
      const category = updatedExtras[categoryName];

      if (isChecked) {
        if (!category) {
          updatedExtras[categoryName] = { category: categoryName, chosen_options: [{name: addonName, quantity: quantities[addonName]}] };
        } else {
          const optionExists = category.chosen_options.some(option => option.name === addonName);
          if (!optionExists) {
            category.chosen_options.push({name: addonName, quantity: quantities[addonName]});
          }
        }
      } else {
        if (category) {
          category.chosen_options = category.chosen_options.filter((option) => option.name !== addonName);
          if (category.chosen_options.length === 0) {
            delete updatedExtras[categoryName];
          }
        }
      }

      return updatedExtras;
    });

    if (isChecked) { 
      setSelectedExtrasPrice((prev) => prev + price * quantity); 
    } 
    else { setSelectedExtrasPrice((prev) => prev - price * quantity); }
  };

  const handleQuantityChange = (option, newQuantity) => {
    const currentQuantity = quantities[option.name];
    const priceDifference = (newQuantity - currentQuantity) * parseFloat(option.price);

    setQuantities((prev) => ({
      ...prev,
      [option.name]: newQuantity,
    }));

    setSelectedExtras((prev) => {
      const updatedExtras = { ...prev };
      const category = updatedExtras[categoryName];

      const optionIndex = category.chosen_options.findIndex(opt => opt.name === option.name);
      if (optionIndex !== -1) {
        category.chosen_options[optionIndex].quantity = newQuantity;
      }

      return updatedExtras;
    });

    if (checkedOptions[option.name]) {
      setSelectedExtrasPrice((prev) => prev + priceDifference);
    }  
  }

  return (
    <>
      {options.map((option, index) => {
        const checked = checkedOptions[option.name];
        return (
          <div key={index} className={`mb-2 p-2 ${checked ? "bg-[#EBEFE8]" : "bg-none"}`}>
            <div 
              className='flex flex-row items-center space-x-4 cursor-pointer'
              onClick={() =>
                handleCheckboxChange({
                  target: {
                    name: option.name,
                    checked: !checkedOptions[option.name],
                    value: option.price.toString(),
                  },
                })
              }
            >
              
              <AddButton 
                checked={checked}
              />

              <div className='md:flex md:flex-row space-between items-center gap-2'>
                <strong>{option.name}</strong>
                <p className="text-[#7D7D7D]">
                  {!option.get_quantity && `$${parseFloat(option.price).toFixed(2)}`}
                </p>

                {option.get_quantity && checkedOptions[option.name] && (
                  <QuantityCounter quantity={quantities[option.name]} setQuantity={(newQuantity) => handleQuantityChange(option, newQuantity)} />
                )}
              </div>
            </div>
          </div>
      )})}
    </>
  )
}

function DropDownOptions({ categoryName, selectedExtras, options, setSelectedExtras, setSelectedExtrasPrice }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (selectedExtras.length > 0) {
      const selectedOption = options.find(
        (option) => option.name === selectedExtras[0]?.name
      );
      setSelectedOption(selectedOption);
    }
  }, [selectedExtras, categoryName, options]);

  useEffect(() => {
    setSelectedExtras((prev) => {
      const updatedExtras = {...prev};
      const category = updatedExtras[categoryName];

      if (!category || !category.chosen_options || category.chosen_options.length === 0) {
        updatedExtras[categoryName] = { 
          category: categoryName, 
          chosen_options: [{ name: options[0].name }] 
        };
      }
      
      return updatedExtras;
    });

    setSelectedExtrasPrice((prev) => prev + options[0].price);
  }, [categoryName, options, setSelectedExtras, setSelectedExtrasPrice]);

  const handleOptionSelect = useCallback(
    (option) => {
      setSelectedExtras((prev) => ({
        ...prev,
        [categoryName]: { category: categoryName, chosen_options: [{name: option.name}] }
      }));

      setSelectedExtrasPrice((prev) => prev - selectedOption.price + option.price);
      setSelectedOption(option);
      setIsDropdownOpen(false);
    },
    [categoryName, selectedOption, setSelectedExtras, setSelectedExtrasPrice]
  );

  return (
    <RadioCards 
      options={options} 
      selected={selectedOption.name} 
      onChange={handleOptionSelect}
    />

    // <div className="relative inline-block text-left">
    //   <button
    //     onClick={toggleDropdown}
    //     className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-[65vw] max-w-[375px]"
    //   >
    //     { selectedOption.name } { selectedOption.price === 0 ? "" : `($${parseFloat(selectedOption.price).toFixed(2)})` }
    //   </button>

    //   {isDropdownOpen && (
    //     <ul className="absolute bg-white border rounded shadow-lg w-full mt-1 max-h-60 overflow-y-auto z-10">
    //       {options.map((option, index) => (
    //         <li
    //           key={index}
    //           value={option.price}
    //           onClick={() => handleOptionSelect(option)}
    //           className={`flex justify-between px-4 py-2 m-2 rounded hover:bg-gray-100 cursor-pointer ${selectedOption.name === option.name ? "bg-lightgreen" : ""}`}
    //         >
    //           {option.name} { option.price === 0 ? "" : `($${parseFloat(option.price).toFixed(2)})` }
    //           {selectedOption.name === option.name && <img src="/icons/checkmark.svg" alt="selected option" width={20} height={20} />}
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
}