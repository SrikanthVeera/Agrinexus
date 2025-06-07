import React from "react";
import { placeOrder } from "../utils/orderUtils";

function ConfirmOrderButton({ orderData, onSuccess }) {
  const handleConfirm = async () => {
    try {
      const orderId = await placeOrder(orderData);
      alert("Order placed! Delivery partner assigned.");
      if (onSuccess) onSuccess(orderId);
      // Optionally: clear cart, redirect, etc.
    } catch (err) {
      alert("Order failed: " + err.message);
    }
  };

  return (
    <button onClick={handleConfirm} className="bg-green-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-green-700">
      Confirm Order
    </button>
  );
}

export default ConfirmOrderButton;
