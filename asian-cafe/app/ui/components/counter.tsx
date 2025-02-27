"use client";

export default function QuantityCounter({ quantity, setQuantity }) {
  
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : quantity);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;

  //   if (value === "") {
  //     setQuantity(1); 
  //     return;
  //   }

  //   const parsedValue = parseInt(value, 10);
  //   if (!isNaN(parsedValue) && parsedValue > 0) {
  //     setQuantity(parsedValue);
  //     quantity = parsedValue;
  //   }
  // };

  // const handleBlur = () => {
  //   if (quantity === "" || isNaN(quantity) || quantity <= 0) {
  //     setQuantity(1);
  //   }
  // };

  return (
    <div className="flex items-center border-2 border-[#EBEFE8] rounded-full w-fit md:flex-1 justify-between text-xl" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={decreaseQuantity}
        className="px-2 md:px-4 py-2 md:hover:bg-[#EBEFE8] rounded-full"
      >
        -
      </button>
      <p className="w-16 text-center" >{quantity}</p>
      {/* <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-12 text-center no-spinner bg-transparent"
        min={1}
      /> */}
      <button
        type="button"
        onClick={increaseQuantity}
        className="px-2 md:px-4 py-2 md:hover:bg-[#EBEFE8] rounded-full"
      >
        +
      </button>
    </div>
  );
}