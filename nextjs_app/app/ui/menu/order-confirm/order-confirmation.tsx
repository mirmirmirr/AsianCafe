export default function Confirmation({ pickupTime, name, phone, orderQuantity, totalPrice }) {
  return (
    <div className="text-center">
      <img src="/icons/checkmark-circle.svg" alt="checkmark circle" width={100} height={100} className='button-green mx-auto'/>
      <h2 className="text-xl font-bold mb-4">Order Confirmed</h2>
      <p className='font-[500]'>{orderQuantity} items for ${totalPrice.toFixed(2)}</p>

      <div className='bg-darkgreen p-4 mt-4 mb-4 rounded-[14px] text-black text-center'>
        <p className='font-[400]'>PICKUP TIME</p>
        <p className='text-[20px] font-bold'>{pickupTime}</p>
      </div>
      <div className='flex flex-col mb-4 text-sm'>
        <p>NAME</p>
        <p className='font-[500] text-lg'>{name}</p>
      </div>
      <div className='flex flex-col mb-4 text-sm'>
        <p>PHONE NUMBER</p>
        <p className='font-[500] text-lg'>{phone}</p>
      </div>
    </div>
  );
}