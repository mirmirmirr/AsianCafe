'use client'

import api from '@/app/lib/axios';
import { useEffect, useState, useCallback } from 'react';
import QuantityCounter from '../components/counter';
import RadioCards from '../components/radio-cards';

export default function ExtraOptions({ itemCode, selectedExtras, setSelectedExtras, setSelectedExtrasPrice }) {
  const [extras, setExtras] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const { data } = await api.get(`/api/extras/${itemCode}`);
        setExtras(data?.extras || []);
      } catch (error) {
        console.error('Error fetching extras:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExtras();
  }, [itemCode]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='space-y-2 mb-2 max-h-[45vh] overflow-y-scroll'>
      {extras.map((category, index) => (
        <div key={index}>
          <h3 className='font-semibold'>{ category.category }</h3>
          {["Rice", "Noodle Type", "Broth"].includes(category.category) ? (
            <DropDownOptions 
              categoryName={category.category}
              selectedExtras={selectedExtras[category.category]?.chosen_options || []}
              options={category.options}
              setSelectedExtras={setSelectedExtras}
              setSelectedExtrasPrice={setSelectedExtrasPrice}
            />
          ) : (
            <RegularOptions 
              categoryName={category.category}
              selectedExtras={selectedExtras[category.category]?.chosen_options || []}
              options={category.options}
              optionIndex={index} 
              setSelectedExtras={setSelectedExtras}
              setSelectedExtrasPrice={setSelectedExtrasPrice}
            />
          )}
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
    console.log("running selected regular for ", categoryName);
    console.log(selectedExtras);
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
    // console.log("checkbox change for ", e.target.name);
    const isChecked = e.target.checked;
    const addonName = e.target.name;
    const price = parseFloat(e.target.value);
    const quantity = quantities[e.target.name];

    setCheckedOptions((prev) => ({
      ...prev,
      [e.target.name]: isChecked,
    }));
    // console.log("here");
    setSelectedExtras((prev) => {
      // console.log("setting extras");
      const updatedExtras = { ...prev };
      const category = updatedExtras[categoryName];
      // console.log(category);

      if (isChecked) {
        if (!category) {
          // console.log("adding new category");
          updatedExtras[categoryName] = { category: categoryName, chosen_options: [{name: addonName, quantity: quantities[addonName]}] };
        } else {
          const optionExists = category.chosen_options.some(option => option.name === addonName);
          if (!optionExists) {
            // console.log("adding new option");
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

      console.log(updatedExtras);
      return updatedExtras;
    });

    if (isChecked) { 
      setSelectedExtrasPrice((prev) => prev + price * quantity); 
    } 
    else { setSelectedExtrasPrice((prev) => prev - price * quantity); }
  };

  const handleQuantityChange = (option, newQuantity) => {
    console.log(newQuantity);
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
      {options.map((option, index) => (
        <div key={index} className='space-y-2'>
          <div className='space-x-2'>
            <input
              type="checkbox"
              id={`option-${optionIndex}-${index}`}
              name={option.name}
              value={option.price}
              onChange={handleCheckboxChange}
              checked={checkedOptions[option.name]}
            />
            <label htmlFor={`option-${optionIndex}-${index}`}>
              {option.name} {!option.get_quantity && `($${parseFloat(option.price).toFixed(2)})` }
            </label>
          </div>

          {option.get_quantity && checkedOptions[option.name] && (
            <QuantityCounter quantity={quantities[option.name]} setQuantity={(newQuantity) => handleQuantityChange(option, newQuantity)} />
          )}
        </div>
      ))}
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
    console.log("running selected dropdown for ", categoryName);
    if (selectedExtras.length > 0) {
      const selectedOption = options.find((option) => option.name === selectedExtras[0]);
      setSelectedOption(selectedOption);
    }
  }, [selectedExtras, categoryName, options]);

  useEffect(() => {
    // sets the default selected option
    setSelectedExtras((prev) => {
      const updatedExtras = {...prev};
      const category = updatedExtras[categoryName];

      if (!category) {
        updatedExtras[categoryName] = { category: categoryName, chosen_options: [options[0].name] };
      } 
      
      console.log(updatedExtras);
      return updatedExtras;
    });

    setSelectedExtrasPrice((prev) => prev + options[0].price);
  }, [categoryName, options, setSelectedExtras, setSelectedExtrasPrice]);

  const handleOptionSelect = useCallback(
    (option) => {
      setSelectedExtras((prev) => ({
        ...prev,
        [categoryName]: { category: categoryName, chosen_options: [option.name] }
      }));

      setSelectedExtrasPrice((prev) => prev - selectedOption.price + option.price);
      setSelectedOption(option);
      setIsDropdownOpen(false);
    },
    [categoryName, selectedOption, setSelectedExtras, setSelectedExtrasPrice]
  );

  console.log("OPTIONS", options);

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