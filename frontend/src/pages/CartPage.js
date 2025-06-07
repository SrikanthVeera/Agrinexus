import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOrder } from "../context/OrderContext";
import { Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SiGooglepay, SiPhonepe } from 'react-icons/si';
import { MdPayment } from 'react-icons/md';
import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useCartContext } from "../context/CartContext";

const CartPage = () => {
  const { t } = useTranslation();
  // Use cart from context only
  const { updateOrderData } = useOrder();
  const navigate = useNavigate();
  const [copiedUpi, setCopiedUpi] = useState("");
  const [copied, setCopied] = useState({});
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { cart: contextCart, addToCart, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const cart = contextCart;

  // Fetch delivery partners for sidebar
  useEffect(() => {
    axios.get("/api/delivery-partner").then(res => setDeliveryPartners(res.data.filter(p => p.available)));
  }, []);

  const handleIncrease = (item) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    axios.put("http://localhost:5001/api/cart/update", {
      user_id: userId,
      product_id: item.product_id,
      quantity: item.quantity + 1,
      type: item.type || 'regular'
    }).then(() => {
      updateQuantity(item.id, item.quantity + 1);
    });
  };

  const handleDecrease = (item) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (item.quantity > 1) {
      axios.put("http://localhost:5001/api/cart/update", {
        user_id: userId,
        product_id: item.product_id,
        quantity: item.quantity - 1,
        type: item.type || 'regular'
      }).then(() => {
        updateQuantity(item.id, item.quantity - 1);
      });
    }
  };

  const handleRemove = (product_id, type) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    axios.delete("http://localhost:5001/api/cart/remove", {
      data: { user_id: userId, product_id, type: type || 'regular' }
    }).then(() => {
      removeFromCart(product_id);
      // Remove copied notifications for this product
      setCopied(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (key.includes(product_id)) {
            delete updated[key];
          }
        });
        return updated;
      });
    });
  };

  const calculateItemTotal = (item) => {
    if (item.kg) {
      return item.price * item.kg * item.quantity;
    }
    return item.price * item.quantity;
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  };

  const handleProceed = async () => {
    if (!cart || cart.length === 0) {
      alert(t("Your cart is empty. Please add items before proceeding."));
      return;
    }
    try {
      const partner = JSON.parse(localStorage.getItem('selectedPartner'));
      const orderItems = cart.map(item => ({
        ...item,
        totalAmount: calculateItemTotal(item)
      }));
      await updateOrderData({
        price: calculateTotal(),
        items: orderItems
      });
      navigate("/delivery-address", { state: { partner } });
    } catch (err) {
      alert(t("Something went wrong. Please try again."));
      console.error(err);
    }
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col md:flex-row">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">{t("Cart")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Details Left Side */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={item.product_id || idx} className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <img
                    src={item.image_url || item.imageUrl || item.image || "https://dummyimage.com/150x150/cccccc/000000&text=No+Image"}
                    onError={(e) => (e.target.src = "https://dummyimage.com/150x150/cccccc/000000&text=No+Image")}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="font-semibold text-lg mb-1">
                      {item.name && item.name.length > 45
                        ? item.name.substring(0, 45) + "..."
                        : item.name}
                    </h2>
                    <p className="text-sm text-gray-600">₹{item.price}/kg</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("Location")}: {item.location}
                    </p>
                    {item.kg && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {t("Quantity")}: {item.kg} kg
                        </p>
                        <p className="text-sm font-semibold">
                          {t("Total for")} {item.kg} kg: ₹{item.price * item.kg}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center mt-2">
                      <span className="text-sm">{t("Units")}:</span>
                      <button
                        onClick={() => handleDecrease(item)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id, item.type)}
                        className="ml-4 text-red-600 hover:underline text-sm"
                      >
                        × {t("REMOVE")}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-green-600 mt-2">
                      {t("Item Total")}: ₹{calculateItemTotal(item)}
                    </p>
                    <p className="text-sm text-gray-500">{t("Free Delivery")}</p>
                    {/* Seller payment info */}
                    {item.sellerGpay && (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SiGooglepay size={18} style={{verticalAlign:'middle'}}/>
                        <span style={{ fontWeight: 500 }}>{t("GPay")}:</span>
                        <span style={{ background: '#f3f3f3', padding: '2px 8px', borderRadius: 4 }}>{item.sellerGpay}</span>
                        <button
                          style={{ padding: '2px 8px', borderRadius: 4, background: '#805ad5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}
                          onClick={() => handleCopy(`gpay${idx}`, item.sellerGpay)}
                        >{t("Copy")}</button>
                        {copied[`gpay${idx}`] && <span style={{ color: '#38b2ac', marginLeft: 6 }}>{t("Copied!")}</span>}
                      </div>
                    )}
                    {item.sellerPhonepe && (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SiPhonepe size={18} style={{verticalAlign:'middle'}}/>
                        <span style={{ fontWeight: 500 }}>{t("PhonePe")}:</span>
                        <span style={{ background: '#f3f3f3', padding: '2px 8px', borderRadius: 4 }}>{item.sellerPhonepe}</span>
                        <button
                          style={{ padding: '2px 8px', borderRadius: 4, background: '#805ad5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}
                          onClick={() => handleCopy(`phonepe${idx}`, item.sellerPhonepe)}
                        >{t("Copy")}</button>
                        {copied[`phonepe${idx}`] && <span style={{ color: '#38b2ac', marginLeft: 6 }}>{t("Copied!")}</span>}
                      </div>
                    )}
                    {item.sellerUpi && (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MdPayment size={18} style={{verticalAlign:'middle'}}/>
                        <span style={{ fontWeight: 500 }}>{t("UPI")}:</span>
                        <span style={{ background: '#f3f3f3', padding: '2px 8px', borderRadius: 4 }}>{item.sellerUpi}</span>
                        <button
                          style={{ padding: '2px 8px', borderRadius: 4, background: '#805ad5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}
                          onClick={() => handleCopy(`upi${idx}`, item.sellerUpi)}
                        >{t("Copy")}</button>
                        {copied[`upi${idx}`] && <span style={{ color: '#38b2ac', marginLeft: 6 }}>{t("Copied!")}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Details Right Side */}
          <div className="bg-white p-4 rounded-lg shadow h-fit flex flex-col">
            <h2 className="text-lg font-semibold border-b pb-2 mb-2">
              {t("Price Details")} ({cart.length} {t("Items")})
            </h2>
            {cart.map((item, idx) => (
              <div key={item.product_id || idx} className="flex justify-between py-1 text-sm">
                <span>{item.name} ({item.quantity} {item.kg ? `× ${item.kg}kg` : t('units')})</span>
                <span>₹{calculateItemTotal(item)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 mt-2 border-t font-semibold">
              <span>{t("Order Total")}</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t("Clicking on 'Continue' will not deduct any money")}
            </p>
            <button
              onClick={handleProceed}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-medium"
            >
              {t("Proceed to Delivery")}
            </button>
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>{t("Your Safety, Our Priority")}</p>
              <p>{t("We ensure safe delivery at every point of contact.")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
