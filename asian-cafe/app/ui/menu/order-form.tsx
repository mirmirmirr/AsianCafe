"use client";
import { useState } from "react";
import ExtraOptions from "./extra-options";

export default function OrderForm({ selectedItem, setSelectedItem }) {
  const [quantity, setQuantity] = useState(1);

  const handleFormClose = () => {
    setSelectedItem(null);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const handleAddToOrder = (e) => {
    e.preventDefault();
    // Logic to add item to the cart (implement your `addToCart` function here)
    console.log("Order added:", {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
    });
    setSelectedItem(null); // Close the form after adding to order
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={handleFormClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <h3 className="text-lg font-bold mb-4">{selectedItem.name}</h3>
        <form onSubmit={handleAddToOrder}>
          {/* <ExtraOptions selectedItem={selectedItem} /> */}
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decreaseQuantity}
                className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                -
              </button>
              <p className="w-6 text-center">{quantity}</p>
              <button
                type="button"
                onClick={increaseQuantity}
                className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="specialRequests" className="block font-medium">
              Special Requests:
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add to Order  ${parseFloat(selectedItem.price).toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}