"use client";

export default function QuantityCounter({ quantity, setQuantity }) {
  
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : quantity);

  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">
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
  )
}