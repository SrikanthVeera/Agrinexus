import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const OrderPlaced = () => {
  const { t } = useTranslation();
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderedProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        setError("Seller not logged in");
        setLoading(false);
        return;
      }
      try {
        // This endpoint returns only products that have been ordered from this seller
        const res = await axios.get(`http://localhost:5001/api/orders/seller-products/${user.id}`);
        setOrderedProducts(res.data);
      } catch (err) {
        setError("Failed to fetch ordered products.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderedProducts();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaSpinner className="text-yellow-500" />;
      case 'processing':
        return <FaBox className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaSpinner className="text-gray-500" />;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${orderId}/status`, { status: newStatus });
      setOrderedProducts(prev => 
        prev.map(order => 
          order.orderId === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 p-4">
      {error}
    </div>
  );
  
  if (!orderedProducts.length) return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">{t("No Orders Yet")}</h2>
      <p className="text-gray-500">{t("You haven't received any orders yet.")}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("Orders Received")}</h2>
      <div className="grid gap-6">
        {orderedProducts.map((order, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{order.name}</h3>
                <p className="text-sm text-gray-500">Order ID: #{order.orderId}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.orderStatus)}
                <span className="font-medium capitalize">{order.orderStatus}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">{t("Quantity")}</p>
                <p className="font-medium">{order.quantity} {order.kg ? 'kg' : 'units'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("Price")}</p>
                <p className="font-medium">₹{order.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("Total Amount")}</p>
                <p className="font-medium">₹{order.price * order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("Order Date")}</p>
                <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{t("Buyer ID")}</p>
                  <p className="font-medium">#{order.buyerId}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="pending">{t("Pending")}</option>
                    <option value="processing">{t("Processing")}</option>
                    <option value="shipped">{t("Shipped")}</option>
                    <option value="delivered">{t("Delivered")}</option>
                    <option value="cancelled">{t("Cancelled")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPlaced; 