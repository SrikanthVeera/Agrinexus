import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, Phone, ShoppingCart, SlidersHorizontal, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { addToCart } = useCartContext();
  const { user: authUser, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Buyer profile state for editing
  const [user, setUser] = useState(() => authUser || { name: '', email: '', phone: '' });
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (authUser) setUser(authUser);
  }, [authUser]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
    } catch (err) {
      alert(t("Failed to fetch products"));
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState(1000);
  const [searchTerm, setSearchTerm] = useState("");

  // Tamil Nadu Districts
  const tamilNaduDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const matchesLocation = !selectedLocation || product.location === selectedLocation;
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLocation && matchesPrice && matchesSearch;
  });

  const handleAddToCart = async (product) => {
    if (!isAuthenticated || !user) {
      alert('Please login to add to cart');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(t("Added to cart!"));
  };

  const handleWhatsAppClick = (phone) => {
    if (!phone) {
      toast.error("Seller's phone number is not available");
      return;
    }
    const message = "Hello, I'm interested in your product. Can you provide more details?";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDirectMessage = (phone) => {
    if (!phone) {
      toast.error("Seller's phone number is not available");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Buyer Profile Section (Left Sidebar) */}
          <div className="w-full md:w-96 md:mr-0 md:ml-0 animate-fade-in">
            <div className="bg-gradient-to-br from-green-200 via-blue-100 to-purple-100 rounded-3xl shadow-xl p-8 flex flex-col gap-6 border-2 border-blue-200 items-center relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-300 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="flex flex-col items-center gap-4 z-10">
                <div className="bg-green-100 rounded-full p-4 flex items-center justify-center shadow-lg animate-bounce-slow">
                  <User className="text-green-600" size={40} />
                </div>
                <div className="flex flex-col gap-1 items-center">
                <div className="text-2xl font-extrabold text-green-700 drop-shadow">{t("Buyer Profile")}</div>
                {editingProfile ? (
                <>
                <input
                className="border p-2 rounded mb-2 w-56 text-center"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                placeholder={t("Name")}
                />
                <input
                className="border p-2 rounded mb-2 w-56 text-center"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
                placeholder={t("Email")}
                />
                <input
                className="border p-2 rounded mb-2 w-56 text-center"
                value={user.phone}
                onChange={e => setUser({ ...user, phone: e.target.value })}
                placeholder={t("Phone")}
                />
                </>
                ) : (
                <>
                <div><span className="font-semibold">{t("Name")}:</span> {user?.name || t("N/A")}</div>
                <div><span className="font-semibold">{t("Email")}:</span> {user?.email || t("N/A")}</div>
                <div><span className="font-semibold">{t("Phone")}:</span> {user?.phone || t("N/A")}</div>
                </>
                )}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full z-10">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-700 text-lg w-full transition-transform duration-200 hover:scale-105"
                >
                  <SlidersHorizontal size={22} />
                  {t("Filters")}
                </button>
                <button
                  onClick={() => navigate('/bulk-order')}
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-purple-700 text-lg w-full transition-transform duration-200 hover:scale-105"
                >
                  <ShoppingCart size={22} />
                  {t("Bulk Order")}
                </button>
                {editingProfile ? (
                  <button
                    onClick={() => {
                      localStorage.setItem("user", JSON.stringify(user));
                      setEditingProfile(false);
                      toast.success(t("Profile updated!"));
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 text-lg w-full transition-transform duration-200 hover:scale-105"
                  >
                    💾 {t("Save")}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 text-lg w-full transition-transform duration-200 hover:scale-105"
                  >
                    ✏️ {t("Edit Profile")}
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Main Content (filters, products) */}
          <div className="flex-1">
            {/* Filters Section */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Select District")}
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">{t("All Districts")}</option>
                      {tamilNaduDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Maximum Price")}: ₹{priceRange}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  {/* Search Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("Search Products")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("Search by product name...")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id || product.id} className="flex flex-col h-full bg-white rounded-2xl shadow-xl p-6">
                  {/* Product Image */}
                  <div className="flex justify-center -mt-12 mb-2">
                    <img
                      src={product.image_url || product.imageUrl || product.image || 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image'}
                      onError={(e) => (e.target.src = 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image')}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-full shadow-lg border-4 border-white"
                      style={{ background: '#fff' }}
                    />
                  </div>
                  {/* Card Content */}
                  <div className="flex-1 flex flex-col justify-between text-center w-full">
                    <div className="font-bold text-lg text-gray-800">{product.name}</div>
                    <div className="text-gray-500 text-sm mb-1">{product.kg ? `${product.kg} kg` : '1 kg'}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-yellow-500 text-base">★ 4.5</span>
                      <span className="text-gray-700 font-semibold text-lg">|</span>
                      <span className="text-gray-800 font-bold text-lg">₹{product.price}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 border-2 border-green-600 text-green-600 text-sm font-medium rounded-lg px-2 py-1 transition hover:bg-green-50"
                      >
                        {t("Add to Cart")}
                      </button>
                      <button
                        onClick={() => navigate('/delivery-address', { state: { product } })}
                        className="flex-1 bg-green-600 text-white text-sm font-medium rounded-lg px-2 py-1 transition hover:bg-green-700"
                      >
                        {t("Buy Now")}
                      </button>
                    </div>
                    {/* Contact and WhatsApp Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleDirectMessage(product.sellerPhone)}
                        className="flex-1 bg-blue-600 text-white text-sm font-medium rounded-lg px-2 py-1 transition hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!product.sellerPhone}
                      >
                        <Phone size={18} />
                        {t("Contact")}
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(product.sellerPhone)}
                        className="flex-1 bg-green-500 text-white text-sm font-medium rounded-lg px-2 py-1 transition hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!product.sellerPhone}
                      >
                        <MessageCircle size={18} />
                        {t("WhatsApp")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* No Results Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">{t("No products found matching your filters.")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerDashboard;
