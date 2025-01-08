"use client";
import { useState } from "react";
import ExtraOptions from "./extra-options";
import QuantityCounter from "./counter";

export default function OrderForm({ selectedItem, setSelectedItem }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtrasPrice, setSelectedExtrasPrice] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const handleFormClose = () => {
    setSelectedItem(null);
  };

  const handleAddToOrder = (e) => {
    e.preventDefault();
    // Logic to add item to the cart (implement your `addToCart` function here)
    console.log("Order added:", {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      extras: selectedExtras,
      total: (selectedItem.price + selectedExtrasPrice) * quantity,
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
          <ExtraOptions itemCode={selectedItem.code} setSelectedExtrasPrice={setSelectedExtrasPrice} setSelectedExtras={setSelectedExtras} />
          <div className="mb-4">
            <label className="block font-medium">
              Special Requests:
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
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
              Add to Order  ${((selectedItem.price + selectedExtrasPrice) * quantity).toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}