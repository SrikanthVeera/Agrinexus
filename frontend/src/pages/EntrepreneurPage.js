import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";

function EntrepreneurPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Entrepreneur user state
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    upi: "",
    gpay: "",
    phonepe: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser && (storedUser.id || storedUser._id);
    if (storedUser && userId) {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios.get(`http://localhost:5001/api/auth/profile/${userId}`, config)
        .then(res => {
          setUser({ ...res.data, id: res.data.id || userId });
        })
        .catch(() => {
          setUser({
            id: userId,
            name: storedUser.name || "",
            email: storedUser.email || "",
            phone: storedUser.phone || "",
            location: "",
            upi: "",
            gpay: "",
            phonepe: "",
          });
        });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const userId = user.id || user._id;
      await axios.put(`http://localhost:5001/api/auth/profile/${userId}`, {
        phone: user.phone,
        location: user.location,
        upi: user.upi,
        gpay: user.gpay,
        phonepe: user.phonepe,
      }, config);
      alert(t("Profile Saved Successfully!"));
      setEditingProfile(false);
      // Update localStorage if needed
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        localStorage.setItem("user", JSON.stringify({
          ...storedUser,
          phone: user.phone
        }));
      }
    } catch (err) {
      alert(t("Failed to save profile"));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-96 bg-gradient-to-br from-blue-200 via-white to-green-200 shadow-2xl p-10 rounded-3xl border-2 border-blue-300 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-900 flex items-center gap-2">
          <User className="inline-block text-blue-500" size={28} /> {t("Entrepreneur Profile")}
        </h2>
        <div className="space-y-4 text-base w-full">
          <div className="flex items-center gap-2">
            <User className="text-blue-500" size={22} />
            <span className="font-semibold">{t("Name:")}</span>
            <span className="ml-1">{user.name || t("N/A")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="text-purple-500" size={22} />
            <span className="font-semibold">{t("Email:")}</span>
            <span className="ml-1">{user.email || t("N/A")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-green-500" size={22} />
            <span className="font-semibold">{t("Phone:")}</span>
            <span className="ml-1">{user.phone || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-pink-500" size={22} />
            <span className="font-semibold">{t("Location:")}</span>
            <span className="ml-1">{user.location || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("UPI:")}</span>
            <span className="ml-1">{user.upi || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("GPay:")}</span>
            <span className="ml-1">{user.gpay || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("PhonePe:")}</span>
            <span className="ml-1">{user.phonepe || t("Not added")}</span>
          </div>
        </div>
        {editingProfile ? (
          <div className="mt-8 space-y-4 w-full">
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleProfileChange}
              placeholder={t("Enter Phone Number")}
              className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            />
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleProfileChange}
              placeholder={t("Enter Location")}
              className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-green-200 focus:outline-none transition"
            />
            <input
              type="text"
              name="upi"
              value={user.upi}
              onChange={handleProfileChange}
              placeholder={t("Enter UPI ID")}
              className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            />
            <input
              type="text"
              name="gpay"
              value={user.gpay}
              onChange={handleProfileChange}
              placeholder={t("Enter GPay Number")}
              className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            />
            <input
              type="text"
              name="phonepe"
              value={user.phonepe}
              onChange={handleProfileChange}
              placeholder={t("Enter PhonePe Number")}
              className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            />
            <button
              onClick={handleSaveProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow transition duration-200"
            >
              {t("Save Profile")}
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setEditingProfile(true)}
              className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow transition duration-200"
            >
              {t("Edit Profile")}
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg shadow transition duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              {t("Logout")}
            </button>
          </>
        )}
      </div>
      {/* Main content area intentionally left blank for entrepreneur profile-only page */}
      <div className="flex-1 p-6">
        {/* Entrepreneur's Products Section */}
        <h3 className="text-lg font-semibold mb-4">{t("Your Bulk Order Products")}</h3>
        <EntrepreneurProductsList userId={user.id || user._id} />
      </div>
    </div>
  );
}

// Component to fetch and display entrepreneur's products
function EntrepreneurProductsList({ userId }) {
  const { t } = useTranslation();
  const [products, setProducts] = React.useState([]);
  const { addToCart } = useCartContext();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!userId) return;
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/bulk-orders?entrepreneur_id=${userId}`);
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [userId]);
  if (!userId) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {products.length === 0 ? (
        <li className="text-gray-500">{t("No products found.")}</li>
      ) : (
        products.map((p) => (
          <li key={p.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <img src={p.image || 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image'} alt={p.name} className="w-32 h-32 object-cover rounded mb-4" />
            <div className="font-bold text-lg mb-2">{p.name}</div>
            <div className="text-gray-600 mb-1">{p.location}</div>
            <div className="text-green-700 font-semibold mb-2">₹{p.price}{p.kg ? ` / ${p.kg}kg` : ''}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addToCart(p)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                {t("Add to Cart")}
              </button>
              <button
                onClick={() => navigate('/delivery-address', { state: { product: p } })}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                {t("Buy Now")}
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

export default EntrepreneurPage;
