'use client'

import api from '@/app/lib/axios';
import { useEffect, useState } from 'react';
import QuantityCounter from './counter';

export default function ExtraOptions({ itemCode, setSelectedExtras, setSelectedExtrasPrice }) {
  const [extras, setExtras] = useState(null);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExtras() {
      try {
        const response = await api.get(`/api/extras/${itemCode}/`);
        const data = response.data;
        setExtras(data["extras"]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching extras:', error);
      }
    }
    fetchExtras();
  }, []);
  
  console.log(extras);
  if (isLoading) return <p>Loading...</p>

  return (
    <div className='space-y-2 mb-4 max-h-[40vh] overflow-y-scroll'>
      {extras.map((category, index) => (
        <div key={index}>
          <h3 className='font-[600]'>{ category.category }</h3>
          {["Rice", "Noodle Type", "Broth"].includes(category.category) ? (
              <DropDownOptions categoryName={category.category} options={category.options} setSelectedExtras={setSelectedExtras} setSelectedExtrasPrice={setSelectedExtrasPrice} />
          ) : (
            <RegularOptions categoryName={category.category}  options={category.options} optionIndex={index} setSelectedExtras={setSelectedExtras} setSelectedExtrasPrice={setSelectedExtrasPrice} />
          )}
        </div>
      ))}
    </div>
  );
}

function RegularOptions({ categoryName, options, optionIndex, setSelectedExtras, setSelectedExtrasPrice }) {
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

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    const addonName = e.target.name;
    const price = parseFloat(e.target.value);
    const quantity = quantities[e.target.name];

    setCheckedOptions((prev) => ({
      ...prev,
      [e.target.name]: isChecked,
    }));
    console.log("here");
    setSelectedExtras((prev) => {
      const updatedExtras = [...prev];
      const categoryIndex = updatedExtras.findIndex((item) => item.category === categoryName);
      console.log("selecting: ", updatedExtras);
      
      if (isChecked) {
        if (categoryIndex === -1) {
          updatedExtras.push({ category: categoryName, chosen_options: [`Add ${addonName}`] });
        } else {
          updatedExtras[categoryIndex].chosen_options.push(`Add ${addonName}`);
        }
      } else {
        if (categoryIndex !== 1) {
          updatedExtras[categoryIndex].chosen_options = updatedExtras[categoryIndex].chosen_options.filter(
            (opt) => opt !== `Add ${addonName}`
          );

          if (updatedExtras[categoryIndex].chosen_options.length === 0) {
            updatedExtras.splice(categoryIndex, 1);
          }
        }
      }

      return updatedExtras;
    })

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

function DropDownOptions({ categoryName, options, setSelectedExtras, setSelectedExtrasPrice }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {

    setSelectedExtras((prev) => {
      const updatedExtras = [...prev];
      const categoryIndex = updatedExtras.findIndex((item) => item.category === categoryName);

      if (categoryIndex === -1) {
        updatedExtras.push({ category: categoryName, chosen_options: [options[0].name] });
      }

      return updatedExtras;
    });

    setSelectedExtrasPrice((prev) => prev + options[0].price);
  }, [categoryName, options, setSelectedExtras, setSelectedExtrasPrice]);

  const handleOptionSelect = (option) => {
    setSelectedExtras((prev) => {
      const updatedExtras = [...prev];
      const categoryIndex = updatedExtras.findIndex((item) => item.category === categoryName);

      if (categoryIndex === -1) {
        updatedExtras.push({ category: categoryName, chosen_options: [option.name] });
      } else {
        updatedExtras[categoryIndex].chosen_options = [option.name];
      }

      return updatedExtras;
    });

    setSelectedExtrasPrice((prev) => prev - selectedOption.price + option.price);    

    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-[375px]"
      >
        { selectedOption.name } { selectedOption.price === 0 ? "" : `($${parseFloat(selectedOption.price).toFixed(2)})` }
      </button>

      {isDropdownOpen && (
        <ul className="absolute bg-white border rounded shadow-lg w-full mt-1 max-h-60 overflow-y-auto z-10">
          {options.map((option, index) => (
            <li
              key={index}
              value={option.price}
              onClick={() => handleOptionSelect(option)}
              className={`flex justify-between px-4 py-2 m-2 rounded hover:bg-gray-100 cursor-pointer ${selectedOption.name === option.name ? "bg-lightgreen" : ""}`}
            >
              {option.name} { option.price === 0 ? "" : `($${parseFloat(option.price).toFixed(2)})` }
              {selectedOption.name === option.name && <img src="/icons/checkmark.svg" alt="selected option" width={20} height={20} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}