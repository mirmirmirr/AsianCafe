"use client";

import api from '@/app/lib/axios';
import { useEffect, useState } from "react";
import { useOrder } from './OrderContext';

import ExtraOptions from "./extra-options";
import QuantityCounter from "./counter";

export default function OrderForm({ selectedItem, setSelectedItem, isEditing = false}) {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(selectedItem.price);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const { updateOrder } = useOrder();

  useEffect(() => {
    console.log("isEditing", isEditing);
    if (isEditing) {
      setQuantity(selectedItem.quantity);
      setSelectedExtras(JSON.parse(selectedItem.extras));
      setSpecialRequests(selectedItem.special_requests || "");
      setUnitPrice(selectedItem.total_price / selectedItem.quantity);
    }
  }, [selectedItem]);

  const handleFormClose = () => {
    setSelectedItem(null);
  };

  const handleAddToOrder = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        menu_item_id: selectedItem.id,
        total_price: (unitPrice) * quantity,
        extras: selectedExtras,
        quantity: quantity,
        special_requests: specialRequests,
      };

      const response = isEditing ? await api.patch(`/api/edit_order_item/${selectedItem.order_item_id}/`, payload, { withCredentials: true }) : await api.post("/api/add_order_item", payload, { withCredentials: true });

      console.log("order added:", response.data);

      updateOrder(); 
      setSelectedItem(null);

    } catch (error) {
      console.error("Error adding order item:", error.response?.data || error.message);
    }

    // Logic to add item to the cart (implement your `addToCart` function here)
    console.log("Order added:", {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      extras: selectedExtras,
      total: (unitPrice) * quantity,
    });
    setSelectedItem(null); // Close the form after adding to order
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={handleFormClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <h3 className="text-lg font-bold mb-4">{selectedItem.name}</h3>
        <form>
          <ExtraOptions itemCode={selectedItem.id} selectedExtras={selectedExtras} setSelectedExtrasPrice={setUnitPrice} setSelectedExtras={setSelectedExtras} />
          <div className="mb-4">
            <label className="block font-medium">
              Special Requests:
            </label>
            <textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder='e.g. "No onions"'
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div className="flex justify-between gap-4">
            <QuantityCounter quantity={quantity} setQuantity={setQuantity} />

            <button
              type="submit"
              className="px-4 py-2 bg-lightgreen text-black rounded hover:bg-darkgreen"
              onClick={handleAddToOrder}
            >
              {isEditing ? "Update Item" : "Add to Order"}  ${((unitPrice) * quantity).toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}