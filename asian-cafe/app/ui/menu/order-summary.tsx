'use client'

import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';
import { useOrder } from './OrderContext';

export default function OrderSummary({ setTotalPrice }) {
  const [orderData, setOrderData] = useState(null);
  const { orderUpdated, updateOrder } = useOrder();

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
  }, [setTotalPrice, orderUpdated]);

  const handleDelete = async (orderId) => {
    try {
      console.log("Deleting order item:", orderId);
      await api.delete(`/api/delete_order_item/${orderId}/`);
      updateOrder(); // Trigger the order update
    } catch (error) {
      console.error("Failed to delete order item:", error);
    }
  };

  return (
    <div className='max-h-[65vh] overflow-y-scroll'>
      {orderData ? (
        <ul>
          {orderData.map((item, index) => (
            <li key={index} className='grid grid-cols-[20px_1fr_55px_10px] gap-x-2 p-[4px]'>
              {item.quantity}
              <div className='start-col-2'>
                {item.menu_item_name}

                {item.extras !== "[]" && <ExtrasDetail jsonString={item.extras} />}
              </div>
              <div className='text-[14px] items-end'>
                ${item.total_price}
              </div>
              <div className='start-col-4'>
                <button onClick={() => handleDelete(item.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function ExtrasDetail({ jsonString }) {
  const data = JSON.parse(jsonString);

  return (
    <div className='text-[14px] text-gray-600'>
      {data.map((item, index) => (
        <div key={index}>
          {/* <h3>{item.category}</h3> */}
          <ul>
            {item.chosen_options.map((option, optionIndex) => (
              <li key={optionIndex}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}