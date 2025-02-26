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
      setTotalPrice(selectedItem.total_price);
    } else {
      setQuantity(1);
      setSelectedExtras([]);
      setSpecialRequests("");
      setUnitPrice(selectedItem.price);
      setTotalPrice(selectedItem.price);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={handleFormClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close order form"
        >
          <img src="/icons/cross.svg" alt="close" width={20} height={20} />
        </button>
        <h3 className="text-lg font-bold mb-4">{selectedItem.name}</h3>
        <form>
          <ExtraOptions itemCode={selectedItem.id} selectedExtras={selectedExtras} setSelectedExtrasPrice={setUnitPrice} setSelectedExtras={setSelectedExtras} />
          <div className="mb-4">
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
        </form>
      </div>
    </div>
  );
}