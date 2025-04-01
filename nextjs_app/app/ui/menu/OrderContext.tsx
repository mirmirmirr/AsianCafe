'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface OrderContextType {
  orderUpdated: boolean;
  updateOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderUpdated, setOrderUpdated] = useState(false);

  const updateOrder = () => {
    setOrderUpdated(prev => !prev);
  };

  return (
    <OrderContext.Provider value={{ orderUpdated, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}