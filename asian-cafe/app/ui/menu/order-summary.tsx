'use client'

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import api from '@/app/lib/axios';
import { useOrder } from './OrderContext';
import OrderForm from './order-form';

export default function OrderSummary({ setTotalPrice }) {
  const [orderData, setOrderData] = useState(null);
  const { orderUpdated, updateOrder } = useOrder();
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get('/api/get_order');
        console.log(response.data["order"]);
        setOrderData(response.data["order"]);

        const totalPrice = response.data["order"].reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    fetchOrder();
  }, [orderUpdated]);

  const handleDelete = async (orderId) => {
    try {
      console.log("Deleting order item:", orderId);
      await api.delete(`/api/delete_order_item/${orderId}/`);
      updateOrder(); // Trigger the order update
    } catch (error) {
      console.error("Failed to delete order item:", error);
    }
  };

  const handleEdit = async (item) => {
    try {
      const response = await api.get(`/api/get_order_item/${item}`);
      setEditingItem(response.data);
      console.log("Editing item:", response.data);
    } catch (error) {
      console.error("Failed to fetch order item:", error);
    };

    setEditMode(true);
  }

  return (
    <div className='max-h-[65vh] overflow-y-scroll'>
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
        <div className='overlay'>

        <OrderForm selectedItem={editingItem} setSelectedItem={setEditMode} isEditing={true} />
        </div>,
        document.body
      )}
    </div>
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
              <li key={optionIndex}>{option}</li>
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