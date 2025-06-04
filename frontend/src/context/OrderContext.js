// context/OrderContext.js
import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState({});

  const updateOrderData = (newData) => {
    setOrderData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <OrderContext.Provider value={{ orderData, updateOrderData }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
