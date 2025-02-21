"use client";

export default function QuantityCounter({ quantity, setQuantity }) {
  
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : quantity);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === "") {
      setQuantity(""); 
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantity(parsedValue);
    }
  };

  const handleBlur = () => {
    if (quantity === "" || isNaN(quantity) || quantity <= 0) {
      setQuantity(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">Quantity:</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decreaseQuantity}
          className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-12 text-center border border-gray-300 rounded no-spinner"
          min={1}
        />
        <button
          type="button"
          onClick={increaseQuantity}
          className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
}