import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaWhatsapp, FaPhone, FaEdit, FaTrash, FaUser, FaCheckCircle, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const buttonStyles = {
  available: "bg-purple-600 hover:bg-purple-700 text-white font-semibold w-full py-2 rounded mb-3 flex items-center justify-center gap-2",
  grid: "grid grid-cols-2 gap-3 w-full",
  btn: "flex items-center justify-center gap-2 py-2 rounded text-base font-medium transition",
  profile: "bg-blue-100 hover:bg-blue-200 text-blue-800",
  call: "bg-green-100 hover:bg-green-200 text-green-800",
  whatsapp: "bg-green-200 hover:bg-green-300 text-green-900",
  edit: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
  delete: "bg-red-100 hover:bg-red-200 text-red-800",
};

const DeliveryPartner = () => {
  const { t } = useTranslation();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', vehicle: '', rating: '', deliveries: '', image: '', available: true, bike_number: '', address: '', license: '', district: '', pincode: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [profileBoy, setProfileBoy] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', phone: '', vehicle: '', rating: '', deliveries: '', image: '', available: true, bike_number: '', address: '', license: '', district: '', pincode: '', experience: '' });
  const [confirmPartner, setConfirmPartner] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};

  // Fetch delivery partners from backend
  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    setLoading(true);
    const res = await axios.get('/api/delivery-partner');
    setDeliveryBoys(res.data);
    setLoading(false);
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery partner?')) {
      await axios.delete(`/api/delivery-partner/${id}`);
      setDeliveryBoys(deliveryBoys.filter(boy => boy.id !== id));
    }
  };

  // Edit
  const openEdit = (boy) => {
    setEditId(boy.id);
    setEditForm({ ...boy });
  };
  const closeEdit = () => {
    setEditId(null);
    setEditForm({ name: '', phone: '', vehicle: '', rating: '', deliveries: '', image: '', available: true, bike_number: '', address: '', license: '', district: '', pincode: '', experience: '' });
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/delivery-partner/${editId}`, editForm);
    closeEdit();
    fetchDeliveryBoys();
  };

  // Toggle availability
  const handleToggleAvailable = async (boy) => {
    await axios.put(`/api/delivery-partner/${boy.id}/availability`, { available: !boy.available });
    setDeliveryBoys(deliveryBoys.map(b => b.id === boy.id ? { ...b, available: !b.available } : b));
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/delivery-partner', addForm);
    setShowAddModal(false);
    setAddForm({ name: '', phone: '', vehicle: '', rating: '', deliveries: '', image: '', available: true, bike_number: '', address: '', license: '', district: '', pincode: '', experience: '' });
    fetchDeliveryBoys();
  };

  const handleConfirmOrder = async () => {
    try {
      let orderPayload;
      if (order) {
        orderPayload = { ...order, deliveryPartner: confirmPartner };
      } else {
        // fallback: dummy data
        orderPayload = {
          buyerId: 1,
          items: [{ name: 'Sample Product', quantity: 1, price: 100 }],
          address: { name: 'Test User', phone: '9999999999', street: '123 Main St', city: 'Chennai', state: 'TN', pincode: '600001' },
          paymentMethod: 'cod',
          totalPrice: 100,
          deliveryPartner: confirmPartner
        };
      }
      const res = await axios.post('/api/orders/place', orderPayload);
      alert('Order confirmed! Order ID: ' + res.data.orderId);
      setConfirmPartner(null);
      // If order came from summary, go to order success page
      if (order) {
        navigate('/order-success', { state: { order: res.data, partner: confirmPartner } });
      }
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col md:flex-row">
      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-green-800 drop-shadow-lg tracking-wide">{t("Delivery Partners")}</h2>
        {loading && <div className="text-center text-gray-500 mb-4">{t("Loading...")}</div>}
        {confirmPartner && (
          <div className="mb-6 flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full max-w-2xl mx-auto">
            <img src={confirmPartner.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-12 h-12 rounded-full border-2 border-green-300" />
            <div className="flex-1">
              <span className="font-semibold text-yellow-900">
                {t("Are you sure you want to confirm this order with")}
                <span className="text-blue-900"> {confirmPartner.name}</span>?
              </span>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={handleConfirmOrder}
            >
              {t("Confirm")}
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
              onClick={() => setConfirmPartner(null)}
            >
              {t("Cancel")}
            </button>
          </div>
        )}
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          {deliveryBoys.map((boy) => (
            <div key={boy.id} className="flex bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden hover:shadow-green-200 transition-all duration-200">
              {/* Left: Profile image and name */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 p-6 min-w-[140px]">
                <img src={boy.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-20 h-20 rounded-full mb-3 border-4 border-green-200 shadow-md" />
                <div className="font-bold text-lg text-gray-800">{boy.name}</div>
              </div>
              {/* Right: Details and buttons */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="mb-3">
                  <div className="text-gray-700 font-semibold mb-1 text-lg">{boy.vehicle}</div>
                  <div className="text-gray-600 mb-1">Deliveries: <b>{boy.deliveries}</b></div>
                  <div className="text-yellow-500 mb-2">⭐ {boy.rating}</div>
                </div>
                <button
                  className={buttonStyles.available + (boy.available ? '' : ' opacity-50')}
                  onClick={() => handleToggleAvailable(boy)}
                >
                  <FaCheckCircle size={18} /> {boy.available ? 'Person Available' : 'Not Available'}
                </button>
                <div className={buttonStyles.grid}>
                  <button title="Profile" className={`${buttonStyles.btn} ${buttonStyles.profile}`} onClick={() => setProfileBoy(boy)}><FaUser size={16} /> Profile</button>
                  <a href={`tel:${boy.phone}`} title="Contact" className={`${buttonStyles.btn} ${buttonStyles.call}`}><FaPhone size={16} /> Contact</a>
                  <a href={`https://wa.me/${boy.phone}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className={`${buttonStyles.btn} ${buttonStyles.whatsapp}`}><FaWhatsapp size={16} /> WhatsApp</a>
                  <button title="Edit" className={`${buttonStyles.btn} ${buttonStyles.edit}`} onClick={() => openEdit(boy)}><FaEdit size={16} /> Edit</button>
                  <button title="Delete" className={`${buttonStyles.btn} ${buttonStyles.delete}`} onClick={() => handleDelete(boy.id)}><FaTrash size={16} /> Delete</button>
                </div>
                <button
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded shadow hover:from-yellow-500 hover:to-yellow-700 transition"
                  onClick={() => {
                    if (order) {
                      setConfirmPartner(boy);
                    } else {
                      setConfirmPartner(boy);
                    }
                  }}
                  disabled={!!confirmPartner}
                >
                  Select for Order
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-green-500 to-blue-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 hover:shadow-green-400 transition-all duration-200 flex items-center justify-center text-3xl border-4 border-white"
          title="Add Delivery Partner"
        >
          <FaPlus />
        </button>
      </div>
      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-blue-200 animate-slide-up">
            <h3 className="text-xl font-bold mb-4 text-blue-700">{t("Edit Delivery Partner")}</h3>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Name")}</label>
              <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full border p-2 rounded" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Phone")}</label>
              <input name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full border p-2 rounded" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Vehicle")}</label>
              <input name="vehicle" value={editForm.vehicle} onChange={handleEditChange} className="w-full border p-2 rounded" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Rating")}</label>
              <input name="rating" type="number" step="0.1" value={editForm.rating} onChange={handleEditChange} className="w-full border p-2 rounded" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Deliveries")}</label>
              <input name="deliveries" type="number" value={editForm.deliveries} onChange={handleEditChange} className="w-full border p-2 rounded" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Image URL")}</label>
              <input name="image" value={editForm.image} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Bike Number")}</label>
              <input name="bike_number" value={editForm.bike_number} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Address")}</label>
              <input name="address" value={editForm.address} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("License")}</label>
              <input name="license" value={editForm.license} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("District")}</label>
              <input name="district" value={editForm.district} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Pincode")}</label>
              <input name="pincode" value={editForm.pincode} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">{t("Experience")}</label>
              <input name="experience" value={editForm.experience} onChange={handleEditChange} className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <input type="checkbox" name="available" checked={!!editForm.available} onChange={handleEditChange} />
              <label>{t("Available")}</label>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded shadow hover:from-blue-700 hover:to-green-600 transition">{t("Save")}</button>
              <button type="button" onClick={closeEdit} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">{t("Cancel")}</button>
            </div>
          </form>
        </div>
      )}
      {/* Profile Modal */}
      {profileBoy && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-200 animate-slide-up">
            <h3 className="text-xl font-bold mb-4 text-green-700">{t("Delivery Partner Profile")}</h3>
            <div className="flex flex-col items-center mb-4">
              <img src={profileBoy.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-24 h-24 rounded-full mb-3 border-4 border-green-300 shadow-lg" />
              <div className="font-bold text-lg text-gray-800">{profileBoy.name}</div>
              <div className="text-gray-600">{profileBoy.phone}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="font-semibold text-gray-700">{t("Vehicle")}:</div><div>{profileBoy.vehicle}</div>
              <div className="font-semibold text-gray-700">{t("Bike Number")}:</div><div>{profileBoy.bike_number}</div>
              <div className="font-semibold text-gray-700">{t("Address")}:</div><div>{profileBoy.address}</div>
              <div className="font-semibold text-gray-700">{t("License")}:</div><div>{profileBoy.license}</div>
              <div className="font-semibold text-gray-700">{t("District")}:</div><div>{profileBoy.district}</div>
              <div className="font-semibold text-gray-700">{t("Pincode")}:</div><div>{profileBoy.pincode}</div>
              <div className="font-semibold text-gray-700">{t("Experience")}:</div><div>{profileBoy.experience}</div>
              <div className="font-semibold text-gray-700">{t("Deliveries")}:</div><div>{profileBoy.deliveries}</div>
              <div className="font-semibold text-gray-700">{t("Rating")}:</div><div>{profileBoy.rating}</div>
            </div>
            <button onClick={() => setProfileBoy(null)} className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded shadow hover:from-green-500 hover:to-blue-600 transition">{t("Close")}</button>
          </div>
        </div>
      )}
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-green-300 animate-slide-up">
            <h3 className="text-xl font-bold mb-4 text-green-700">{t("Add Delivery Partner")}</h3>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Name")}</label><input name="name" value={addForm.name} onChange={handleAddChange} className="w-full border p-2 rounded" required /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Phone")}</label><input name="phone" value={addForm.phone} onChange={handleAddChange} className="w-full border p-2 rounded" required /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Vehicle")}</label><input name="vehicle" value={addForm.vehicle} onChange={handleAddChange} className="w-full border p-2 rounded" required /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Rating")}</label><input name="rating" type="number" step="0.1" value={addForm.rating} onChange={handleAddChange} className="w-full border p-2 rounded" required /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Deliveries")}</label><input name="deliveries" type="number" value={addForm.deliveries} onChange={handleAddChange} className="w-full border p-2 rounded" required /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Image URL")}</label><input name="image" value={addForm.image} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Bike Number")}</label><input name="bike_number" value={addForm.bike_number} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Address")}</label><input name="address" value={addForm.address} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("License")}</label><input name="license" value={addForm.license} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("District")}</label><input name="district" value={addForm.district} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Pincode")}</label><input name="pincode" value={addForm.pincode} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-3"><label className="block mb-1 font-medium">{t("Experience")}</label><input name="experience" value={addForm.experience} onChange={handleAddChange} className="w-full border p-2 rounded" /></div>
            <div className="mb-4 flex items-center gap-2"><input type="checkbox" name="available" checked={!!addForm.available} onChange={handleAddChange} /><label>{t("Available")}</label></div>
            <div className="flex gap-3 mt-4"><button type="submit" className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-4 py-2 rounded shadow hover:from-green-700 hover:to-blue-600 transition">{t("Add")}</button><button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">{t("Cancel")}</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartner;
