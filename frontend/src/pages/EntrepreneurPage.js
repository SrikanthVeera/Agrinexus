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
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 animate-fadein">
      <div className="w-96 bg-gradient-to-br from-blue-400 via-white to-green-300 shadow-2xl p-0 rounded-3xl border-4 border-blue-400 flex flex-col items-center animate-fadein-slow overflow-hidden">
        {/* Profile Avatar */}
        <div className="w-full flex flex-col items-center bg-gradient-to-r from-blue-500 via-green-400 to-purple-400 py-8 animate-fadein">
          <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-blue-200 animate-fadein-slow">
            <User className="text-blue-500 animate-bounce-slow" size={60} />
          </div>
          <div className="mt-4 text-2xl font-extrabold text-white drop-shadow-lg animate-fadein">{user.name || t("Entrepreneur")}</div>
          <div className="text-white text-sm font-medium animate-fadein-slow">{user.email || t("N/A")}</div>
        </div>
        {/* Profile Details */}
        <div className="w-full px-8 py-6 space-y-4 text-base animate-fadein-slow">
          <div className="flex items-center gap-3">
            <Phone className="text-green-500" size={22} />
            <span className="font-semibold text-gray-700">{t("Phone:")}</span>
            <span className="ml-1 text-gray-600">{user.phone || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-pink-500" size={22} />
            <span className="font-semibold text-gray-700">{t("Location:")}</span>
            <span className="ml-1 text-gray-600">{user.location || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-blue-700">{t("UPI:")}</span>
            <span className="ml-1 text-gray-600">{user.upi || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-green-700">{t("GPay:")}</span>
            <span className="ml-1 text-gray-600">{user.gpay || t("Not added")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-purple-700">{t("PhonePe:")}</span>
            <span className="ml-1 text-gray-600">{user.phonepe || t("Not added")}</span>
          </div>
        </div>
        {/* Edit Form */}
        {editingProfile ? (
          <div className="w-full px-8 pb-8 animate-fadein-slow">
            <div className="space-y-4">
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleProfileChange}
                placeholder={t("Enter Phone Number")}
                className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition shadow"
              />
              <input
                type="text"
                name="location"
                value={user.location}
                onChange={handleProfileChange}
                placeholder={t("Enter Location")}
                className="border border-green-200 p-2 w-full rounded focus:ring-2 focus:ring-green-200 focus:outline-none transition shadow"
              />
              <input
                type="text"
                name="upi"
                value={user.upi}
                onChange={handleProfileChange}
                placeholder={t("Enter UPI ID")}
                className="border border-blue-200 p-2 w-full rounded focus:ring-2 focus:ring-blue-200 focus:outline-none transition shadow"
              />
              <input
                type="text"
                name="gpay"
                value={user.gpay}
                onChange={handleProfileChange}
                placeholder={t("Enter GPay Number")}
                className="border border-green-200 p-2 w-full rounded focus:ring-2 focus:ring-green-200 focus:outline-none transition shadow"
              />
              <input
                type="text"
                name="phonepe"
                value={user.phonepe}
                onChange={handleProfileChange}
                placeholder={t("Enter PhonePe Number")}
                className="border border-purple-200 p-2 w-full rounded focus:ring-2 focus:ring-purple-200 focus:outline-none transition shadow"
              />
              <button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-300 animate-fadein"
              >
                {t("Save Profile")}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full px-8 pb-8 flex flex-col gap-4 animate-fadein-slow">
            <button
              onClick={() => setEditingProfile(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-300 animate-fadein"
            >
              {t("Edit Profile")}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-purple-500 hover:from-purple-500 hover:to-red-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 animate-fadein"
            >
              <LogOut size={18} />
              {t("Logout")}
            </button>
          </div>
        )}
      </div>
      {/* Main content area intentionally left blank for entrepreneur profile-only page */}
      <div className="flex-1 p-8">
        {/* Entrepreneur's Products Section */}
        <h3 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-600 to-purple-600 animate-fadein-slow drop-shadow-lg">{t("Your Bulk Order Products")}</h3>
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

  const handleWhatsAppClick = (phone) => {
    const message = "Hello, I'm interested in your product. Can you provide more details?";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!userId) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {products.length === 0 ? (
        <div className="text-gray-500 col-span-2 animate-fadein-slow">{t("No products found.")}</div>
      ) : (
        products.map((product, idx) => (
          <div
            key={product.id}
            className="bg-gradient-to-br from-white via-blue-50 to-green-100 rounded-2xl shadow-2xl p-8 flex items-center gap-8 transform transition duration-500 hover:scale-105 hover:shadow-emerald-400/50 hover:bg-gradient-to-tr hover:from-green-100 hover:to-purple-100 animate-fadein"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <img
              src={product.image || 'https://dummyimage.com/100x100/cccccc/000000&text=No+Image'}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-xl shadow-md border-4 border-white animate-fadein"
            />
            <div className="flex-1">
              <div className="font-extrabold text-xl text-blue-800 mb-1 animate-fadein-slow">{product.name}</div>
              <div className="text-green-700 font-semibold text-lg mb-1 animate-fadein">{product.kg} kg | ₹{product.price} per kg</div>
              <div className="text-gray-500 text-sm mb-1 animate-fadein">{product.location}</div>
              <div className="text-purple-600 text-xs animate-fadein-slow">{t("Contact")}: {product.phone}</div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => addToCart(product)}
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 font-bold transition-all duration-300 animate-fadein"
              >
                {t("Add to Cart")}
              </button>
              <button
                onClick={() => handleWhatsAppClick(product.phone)}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg shadow hover:from-green-700 hover:to-green-500 font-bold transition-all duration-300 animate-fadein-slow"
              >
                {t("WhatsApp")}
              </button>
              <button
                onClick={() => navigate('/delivery-address', { state: { product } })}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-500 hover:to-purple-500 font-bold transition-all duration-300 animate-fadein"
              >
                {t("Buy Now")}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EntrepreneurPage;
