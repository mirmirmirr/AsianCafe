"use client";

import api from '@/app/lib/axios';
import { useEffect, useState } from "react";
import { useOrder } from './OrderContext';

import ExtraOptions from "./extra-options";
import QuantityCounter from "../components/counter";

export default function OrderForm({ selectedItem, setSelectedItem, isEditing = false}) {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(selectedItem.price);
  const [totalPrice, setTotalPrice] = useState(unitPrice * quantity);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const { updateOrder } = useOrder();

  useEffect(() => {
    setTotalPrice(unitPrice * quantity);
  }, [unitPrice, quantity]);

  useEffect(() => {
    if (!selectedItem) return;
    
    console.log("isEditing", isEditing);
    if (isEditing) {
      setQuantity(selectedItem.quantity);
      setSelectedExtras(JSON.parse(selectedItem.extras || "[]"));
      setSpecialRequests(selectedItem.special_requests || "");
      setUnitPrice(selectedItem.total_price / selectedItem.quantity);
    } else {
      setQuantity(1);
      setSelectedExtras([]);
      setSpecialRequests("");
      setUnitPrice(selectedItem.price);
    }
  }, [selectedItem, isEditing]);


  const handleFormClose = () => {
    setSelectedItem(null);
  };

  const handleAddToOrder = async (e) => {
    e.preventDefault();
    
    if (!selectedItem || !quantity) {
      console.error("Invalid order: Missing item or quantity");
      return;
    }
  
    const payload = {
      menu_item_id: selectedItem.id,
      total_price: totalPrice,
      extras: selectedExtras,
      quantity,
      special_requests: specialRequests.trim(),
    };
  
    try {
      const endpoint = isEditing 
        ? `/api/order_item/${selectedItem.order_item_id}`
        : "/api/add_order_item";
      
      const method = isEditing ? api.patch : api.post;
  
      const response = await method(endpoint, payload, { withCredentials: true });
  
      console.log("Order updated:", response.data);
  
      updateOrder();
      setSelectedItem(null);
    } catch (error) {
      console.error("Error adding order item:", error.response?.data || error.message);
    }
  };  

  return (
    <div className="bg-white p-8 rounded-[20px] shadow-lg relative w-[75vw] md:w-[40vw]">
      <div className='flex flex-row justify-between mb-2'>
        <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
        <button
          onClick={handleFormClose}
          aria-label="Close order form"
        >
          <img src="/icons/cross.svg" alt="close" width={20} height={20} />
        </button>
      </div>
      <ExtraOptions itemCode={selectedItem.id} selectedExtras={selectedExtras} setSelectedExtrasPrice={setUnitPrice} setSelectedExtras={setSelectedExtras} />
      <div className="mb-2">
        <label className="block font-medium">
          Special Requests:
        </label>
        <p className='text-[14px] text-gray-600 mb-2'>If a price adjustment is needed, it will be charged to your order.</p>
        <textarea
          id="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder='e.g. "No onions"'
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <div className="flex md:flex-row flex-col justify-between gap-4">
        <QuantityCounter quantity={quantity} setQuantity={setQuantity} />

        <button
          type="button"
          className="px-4 py-2 bg-lightgreen text-black rounded hover:bg-darkgreen"
          onClick={handleAddToOrder}
        >
          {isEditing ? "Update Item" : "Add to Order"}  ${totalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
}