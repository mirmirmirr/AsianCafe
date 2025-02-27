"use client";

import api from '@/app/lib/axios';
import { useEffect, useState } from "react";
import { useOrder } from '../OrderContext';

import ExtraOptions from "./extra-options";
import QuantityCounter from "../../components/counter";
import SpecialRequests from './special-request';

export default function OrderForm({ selectedItem, setSelectedItem, isEditing = false}) {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(selectedItem.price);
  const [totalPrice, setTotalPrice] = useState(unitPrice * quantity);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const [addingSpecialRequests, setAddingSpecialRequests] = useState(false);
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
    <div className='bg-white relative bottom-0 rounded-t-[20px] shadow-lg sticky bottom-0 w-screen h-1/2'>
      <div className='pb-0 p-8 flex flex-row justify-between mb-2'>
        <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
        <button
          onClick={handleFormClose}
          aria-label="Close order form"
        >
          <img src="/icons/cross.svg" alt="close" width={20} height={20} />
        </button>
      </div>
      <ExtraOptions itemCode={selectedItem.id} selectedExtras={selectedExtras} setSelectedExtrasPrice={setUnitPrice} setSelectedExtras={setSelectedExtras} />
      
      <div onClick={() => setAddingSpecialRequests(!addingSpecialRequests)} className="mb-2 m-8 mt-2 px-4 py-2 border border-lightgreen font-medium">
        {specialRequests 
          ? (
            <div>
              <p>Special Requests:</p>
              <p className="text-sm font-normal">{specialRequests}</p>
            </div>
           ) 
          : "Add Special Requests"
        }
      </div>

      {addingSpecialRequests && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setAddingSpecialRequests(false)}
            aria-label="Close special requests overlay"
          ></div>

          <SpecialRequests 
            specialRequests={specialRequests} 
            setSpecialRequests={setSpecialRequests} 
            closeRequest={() => setAddingSpecialRequests(false)}
          />
        </>
      )}

      <div className="flex flex-row justify-between gap-4 p-8 pt-0">
       <QuantityCounter quantity={quantity} setQuantity={setQuantity} />
        
        <button
          type="button"
          className="px-4 py-3 bg-darkgreen text-white font-bold rounded-full w-[70%] hover:bg-darkgreen"
          onClick={handleAddToOrder}
        >
          {isEditing ? "Update Item" : "Add to Order"}  ${totalPrice.toFixed(2)}
        </button>
      </div>      
    </div>
  );
}