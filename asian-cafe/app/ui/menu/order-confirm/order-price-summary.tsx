
export default function OrderPriceSummary({ totalPrice }) {
  return (
    <div className='flex flex-row m-2 pb-14 justify-between'>
      <h3 className="block text-md font-medium">Summary</h3>
      <div>
        <div className='grid grid-cols-2 gap-2 border-b-2 w-[175px]'>
          <div>
            <p className="text-md">SubTotal</p>
            <p className="text-md">Tax</p>
          </div>
          <div>
            <p className="text-md text-right">${totalPrice.toFixed(2)}</p>
            <p className="text-md text-right">${(totalPrice * 0.08).toFixed(2)}</p>
          </div>
        </div>
        <div className='flex flex-row justify-between mt-2'>
          <h3 className="text-md font-bold">Total</h3>
          <p className="text-md font-bold">${(totalPrice * 1.08).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}