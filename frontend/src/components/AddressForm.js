import { useState } from "react";
import { useOrder } from "../context/OrderContext";
import { useLocation, useNavigate } from "react-router-dom";

const AddressForm = () => {
  const { updateOrderData } = useOrder();
  const location = useLocation();
  let partner = location.state?.partner;
  if (!partner) {
    try {
      partner = JSON.parse(localStorage.getItem('selectedPartner'));
    } catch {}
  }
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData({ address: form });
    navigate('/order-success', { state: { partner, address: form } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Enter Delivery Address</h2>
      {!partner && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-4">
          <div className="flex-1">
            <div className="font-bold text-lg text-yellow-900">No Delivery Partner Selected</div>
            <div className="text-gray-700">Please select a delivery partner before proceeding.</div>
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-2 rounded shadow hover:bg-blue-600 transition"
            onClick={() => navigate('/cart')}
          >
            Select Delivery Partner
          </button>
        </div>
      )}
      {partner && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-4">
          <img src={partner.image || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="profile" className="w-14 h-14 rounded-full border-2 border-green-300" />
          <div className="flex-1">
            <div className="font-bold text-lg text-blue-900">Delivery Partner: {partner.name}</div>
            <div className="text-gray-700">Phone: {partner.phone}</div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.name + ' ' + partner.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-3 py-2 rounded shadow hover:bg-green-600 transition"
          >
            Live Location
          </a>
        </div>
      )}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={form.pincode}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Save Address
      </button>
    </form>
  );
};

export default AddressForm;
