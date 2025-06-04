import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { SiGooglepay, SiPhonepe } from 'react-icons/si';
import { MdPayment } from 'react-icons/md';
import axios from "axios";

const OrderSuccessPage = () => {
  const { clearCart } = useCartContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { order, paymentDetails, partner } = location.state || {};
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(partner || null);

  useEffect(() => {
    if (!order || !paymentDetails) {
      navigate('/cart');
      return;
    }
    clearCart(); // Clear cart after successful order
  }, []);

  useEffect(() => {
    axios.get("/api/delivery-partner").then(res => setDeliveryPartners(res.data.filter(p => p.available)));
  }, []);

  if (!order || !paymentDetails) {
    return null;
  }

  const getPaymentMethodIcon = () => {
    switch (paymentDetails.method) {
      case 'gpay':
        return <SiGooglepay size={24} />;
      case 'phonepe':
        return <SiPhonepe size={24} />;
      case 'upi':
        return <MdPayment size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Thank you for your purchase.</p>
        </div>

        <div className="border-t border-b py-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Order ID:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Payment Method:</span>
            <div className="flex items-center gap-2">
              {getPaymentMethodIcon()}
              <span>{paymentDetails.method === 'cod' ? 'Cash on Delivery' : 
                paymentDetails.method === 'gpay' ? 'Google Pay' :
                paymentDetails.method === 'phonepe' ? 'PhonePe' :
                paymentDetails.method === 'upi' ? 'UPI' : paymentDetails.method}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-lg font-bold">₹{order.price}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Delivery Address:</h3>
          <p className="text-gray-600">
            {order.address.name}<br />
            {order.address.address}<br />
            {order.address.district}, {order.address.state} - {order.address.pincode}<br />
            Phone: {order.address.phone}
          </p>
        </div>

        {/* Delivery Partner Details */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Available Delivery Partners:</h3>
          <div className="flex flex-col gap-4">
            {deliveryPartners.map((boy) => (
              <div key={boy.id} className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 shadow hover:shadow-lg transition">
                <img src={boy.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-12 h-12 rounded-full border-2 border-green-300" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{boy.name}</div>
                  <div className="text-xs text-gray-500">{boy.vehicle}</div>
                </div>
                <button
                  className={`bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded shadow hover:from-blue-600 hover:to-green-600 transition ${selectedPartner && selectedPartner.id === boy.id ? 'ring-4 ring-green-400' : ''}`}
                  onClick={() => setSelectedPartner(boy)}
                >
                  {selectedPartner && selectedPartner.id === boy.id ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </div>
        {selectedPartner && (
          <>
          <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-4">
            <img src={selectedPartner.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-14 h-14 rounded-full border-2 border-green-300" />
            <div className="flex-1">
              <div className="font-bold text-lg text-blue-900">Delivery Partner: {selectedPartner.name}</div>
              <div className="text-gray-700">Phone: {selectedPartner.phone}</div>
              <div className="flex gap-2 mt-2">
                <a href={`tel:${selectedPartner.phone}`} className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition">Contact</a>
                <a href={`https://wa.me/${selectedPartner.phone}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition">WhatsApp</a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPartner.name + ' ' + selectedPartner.phone)}`} target="_blank" rel="noopener noreferrer" className="bg-gray-500 text-white px-3 py-1 rounded shadow hover:bg-gray-600 transition">Live Location</a>
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <img src={selectedPartner.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-12 h-12 rounded-full border-2 border-green-300" />
            <div className="flex-1">
              <span className="font-semibold text-yellow-900">Are you sure you want to confirm order with <span className="text-blue-900">{selectedPartner.name}</span>?</span>
            </div>
          </div>
          </>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/buyer/dashboard')}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
