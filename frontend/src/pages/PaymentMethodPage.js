import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initiatePayment, checkPaymentStatus } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import './PaymentMethodPage.css';
import { FiPhoneCall, FiMapPin } from 'react-icons/fi';
import { SiGooglepay, SiPhonepe } from 'react-icons/si';
import { MdPayment } from 'react-icons/md';
import { QRCodeCanvas } from 'qrcode.react';

const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, totalAmount } = location.state || {};
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState({});

  useEffect(() => {
    if (!order || !totalAmount) {
      navigate('/cart');
    }
  }, [order, totalAmount, navigate]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    if (selectedMethod === 'upi' && !upiId) {
      setError('Please enter your UPI ID');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      
      const response = await initiatePayment(
        user.id,
        totalAmount,
        selectedMethod
      );

      if (response && response.paymentId) {
        setPaymentStatus('Payment successful!');
        setTimeout(() => {
          navigate('/order-confirmation', { 
            state: { 
              order, 
              paymentDetails: { 
                ...response,
                method: selectedMethod
              } 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for GPay deep link
  const getSellerUpi = () => {
    // Try to get sellerUpi from first item in order
    if (order.items && order.items[0] && order.items[0].sellerUpi) {
      return order.items[0].sellerUpi;
    }
    // fallback: try from localStorage user
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.upi) return user.upi;
    return 'test@okicici';
  };

  const openGPay = () => {
    const upiId = getSellerUpi();
    const amount = totalAmount;
    const payeeName = 'Agri Seller';
    const url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
    // Try to open in GPay (works on mobile)
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = url;
    } else {
      alert('GPay/UPI deep links only work on mobile devices. Please scan the UPI QR or use your mobile for payment.');
    }
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500);
  };

  if (!order || !totalAmount) {
    return null;
  }

  return (
    <div className="payment-method-container">
      <h2>Select Payment Method</h2>
      
      <div className="payment-methods">
        <div className="payment-method">
          <input
            type="radio"
            id="gpay"
            name="payment"
            value="gpay"
            checked={selectedMethod === 'gpay'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor="gpay"><SiGooglepay size={20} style={{verticalAlign:'middle',marginRight:6}}/>Google Pay</label>
        </div>

        <div className="payment-method">
          <input
            type="radio"
            id="phonepe"
            name="payment"
            value="phonepe"
            checked={selectedMethod === 'phonepe'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor="phonepe"><SiPhonepe size={20} style={{verticalAlign:'middle',marginRight:6}}/>PhonePe</label>
        </div>

        <div className="payment-method">
          <input
            type="radio"
            id="upi"
            name="payment"
            value="upi"
            checked={selectedMethod === 'upi'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor="upi"><MdPayment size={20} style={{verticalAlign:'middle',marginRight:6}}/>UPI</label>
        </div>

        <div className="payment-method">
          <input
            type="radio"
            id="cod"
            name="payment"
            value="cod"
            checked={selectedMethod === 'cod'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor="cod"><b>Cash on Delivery</b></label>
        </div>
      </div>

      {selectedMethod === 'upi' && (
        <div className="upi-input">
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        </div>
      )}

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total Amount: ₹{totalAmount}</p>
        {order.items.map((item, idx) => (
          <div key={item.id} className="order-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
              {/* Always show seller payment info here */}
              {item.sellerGpay && (
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
                  <SiGooglepay size={18} style={{verticalAlign:'middle'}}/>
                  <span><b>GPay:</b> {item.sellerGpay}</span>
                  <button
                    style={{padding:'2px 8px',borderRadius:4,background:'#805ad5',color:'#fff',border:'none',cursor:'pointer',fontSize:13}}
                    onClick={() => handleCopy(`gpay${idx}`, item.sellerGpay)}
                  >Copy</button>
                  {copied[`gpay${idx}`] && <span style={{color:'#38b2ac',marginLeft:4}}>Copied!</span>}
                </div>
              )}
              {item.sellerPhonepe && (
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
                  <SiPhonepe size={18} style={{verticalAlign:'middle'}}/>
                  <span><b>PhonePe:</b> {item.sellerPhonepe}</span>
                  <button
                    style={{padding:'2px 8px',borderRadius:4,background:'#805ad5',color:'#fff',border:'none',cursor:'pointer',fontSize:13}}
                    onClick={() => handleCopy(`phonepe${idx}`, item.sellerPhonepe)}
                  >Copy</button>
                  {copied[`phonepe${idx}`] && <span style={{color:'#38b2ac',marginLeft:4}}>Copied!</span>}
                </div>
              )}
              {item.sellerUpi && (
                <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
                  <MdPayment size={18} style={{verticalAlign:'middle'}}/>
                  <span><b>UPI:</b> {item.sellerUpi}</span>
                  <button
                    style={{padding:'2px 8px',borderRadius:4,background:'#805ad5',color:'#fff',border:'none',cursor:'pointer',fontSize:13}}
                    onClick={() => handleCopy(`upi${idx}`, item.sellerUpi)}
                  >Copy</button>
                  {copied[`upi${idx}`] && <span style={{color:'#38b2ac',marginLeft:4}}>Copied!</span>}
                  {/* Show QR code for UPI */}
                  <span style={{marginLeft:8}}>
                    <QRCodeCanvas value={`upi://pay?pa=${item.sellerUpi}&pn=Agri Seller&am=${item.price * item.quantity}&cu=INR`} size={48} />
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Contact and Live Location buttons with animation and icons */}
        <div className="order-action-buttons">
          <button
            className="contact-button animated-btn"
            onClick={() => window.open(`tel:${order.address?.phone || ''}`, '_self')}
            disabled={!order.address?.phone}
            title={order.address?.phone ? `Call ${order.address.phone}` : 'No phone number'}
          >
            <FiPhoneCall size={20} style={{ marginRight: 8 }} /> Contact
          </button>
          <button
            className="location-button animated-btn"
            onClick={() => {
              // Use full address for Google Maps
              const addr = order.address ? [order.address.street, order.address.city, order.address.state, order.address.pincode].filter(Boolean).join(', ') : '';
              if (addr) {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
              } else if (order.address?.address) {
                // fallback for textarea address
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address.address)}`, '_blank');
              }
            }}
            disabled={!(order.address && (order.address.street || order.address.address))}
            title={order.address ? `Show location: ${order.address.street || order.address.address}` : 'No location'}
          >
            <FiMapPin size={20} style={{ marginRight: 8 }} /> Live Location
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {paymentStatus && <div className="payment-status">{paymentStatus}</div>}

      <div className="payment-actions">
        <button
          onClick={() => navigate('/cart')}
          className="back-button"
        >
          Back to Cart
        </button>
        <button
          onClick={selectedMethod === 'gpay' ? openGPay : selectedMethod === 'cod' ? () => {
            setPaymentStatus('Order placed! Please pay cash on delivery.');
            setTimeout(() => {
              navigate('/order-confirmation', { 
                state: { 
                  order, 
                  paymentDetails: { 
                    method: 'Cash on Delivery',
                    paymentId: `COD_${Date.now()}`
                  } 
                } 
              });
            }, 2000);
          } : handlePayment}
          disabled={isProcessing}
          className="pay-button"
        >
          {selectedMethod === 'gpay' ? (
            <><SiGooglepay size={22} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Pay with GPay</>
          ) : selectedMethod === 'cod' ? (
            isProcessing ? 'Placing Order...' : 'Place Order (COD)'
          ) : isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
