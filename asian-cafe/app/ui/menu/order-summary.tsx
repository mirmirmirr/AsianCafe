'use client'

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import api from '@/app/lib/axios';
import { useOrder } from './OrderContext';
import OrderForm from './mi-customization/order-form';

export default function OrderSummary({ setTotalPrice, setOrderQuantity }) {
  return (
    <div className='max-h-[65vh] overflow-y-scroll'>
      <OrderSummaryList setTotalPrice={setTotalPrice} setOrderQuantity={setOrderQuantity} />
    </div>
  )
};

export function OrderSummaryList({ setTotalPrice, setOrderQuantity }) {
  const [orderData, setOrderData] = useState(null);
  const { orderUpdated, updateOrder } = useOrder();
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  const closeOrder = () => {
    setAnimateIn(false);
    setTimeout(() => setEditMode(false), 300);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get('/api/get_order');
        console.log(response.data["order"]);
        setOrderData(response.data["order"]);

        const totalPrice = response.data["order"].reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
        setTotalPrice(totalPrice);
        
        const orderQuantity = response.data["order"].reduce((sum, item) => sum + parseInt(item.quantity), 0);
        setOrderQuantity(orderQuantity);

      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    fetchOrder();
  }, [orderUpdated]);

  const handleDelete = async (orderId) => {
    try {
      console.log("Deleting order item:", orderId);
      await api.delete(`/api/order_item/${orderId}`);
      updateOrder(); // Trigger the order update
    } catch (error) {
      console.error("Failed to delete order item:", error);
    }
  };

  const handleEdit = async (item) => {
    try {
      const response = await api.get(`/api/order_item/${item}`);
      setEditingItem(response.data);
      console.log("Editing item:", response.data);
    } catch (error) {
      console.error("Failed to fetch order item:", error);
    };

    setEditMode(true);
    setAnimateIn(true);
  }

  return (
    <>
      {orderData ? (
        <ul>
          {orderData.map((item, index) => (
            <li key={index} className='grid grid-cols-[20px_1fr_55px_15px] gap-x-2 p-[4px]'>
              {item.quantity}
              <div className='start-col-2'>
                <div className='hover:underline' onClick={() => handleEdit(item.id)}>
                  {item.menu_item_name}
                </div>

                {item.extras !== "[]" && <ExtrasDetail jsonString={item.extras} specialRequests={item.special_requests}/>}
              </div>
              <div className='text-[14px] items-end'>
                ${item.total_price}
              </div>
              <div className='start-col-4'>
                <button onClick={() => handleDelete(item.id)} className='button-hover-red'>
                  <img src="/icons/delete.svg" alt="selected option" width={100} height={100} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      {editMode && editingItem && ReactDOM.createPortal (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto">
          <div 
            className={`
              absolute inset-0 bg-black bg-opacity-50 
              transition-opacity duration-300
              ${animateIn ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={closeOrder}
          />

          <div
            className={`
              transition-opacity duration-300
              ${animateIn ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <OrderForm selectedItem={editingItem} setSelectedItem={setEditMode} isEditing={true} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function ExtrasDetail({ jsonString, specialRequests }) {
  const data = JSON.parse(jsonString);

  return (
    <div className='text-[14px] text-gray-600'>
      {Object.keys(data).map((key, index) => (
        <div key={index}>
          <ul>
            {data[key].chosen_options.map((option, optionIndex) => (
              <li key={optionIndex}>{option.name} {option.quantity > 1 && ( `(${option.quantity})` )} </li>
            ))}
          </ul>
        </div>
      ))}
      {specialRequests && (
        <div>
          <strong>Special Requests:</strong> {specialRequests}
        </div>
      )}
    </div>
  );
}