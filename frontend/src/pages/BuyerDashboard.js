import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, Phone, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { addToCart } = useCartContext();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ];

  const showAddToCartPopup = (product) => {
    toast.success(
      <div style={{ minWidth: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={product.image_url || product.imageUrl || product.image || "https://dummyimage.com/60x60/cccccc/000000&text=No+Image"} alt={product.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{product.name}</div>
            <div style={{ fontSize: 13, color: '#666' }}>{product.kg ? `${product.kg} kg` : product.volume ? `${product.volume}` : ''} ×1</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ background: '#e53e3e', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontSize: 15 }}>₹{product.price}</span>
              {product.oldPrice && (
                <span style={{ background: '#f6e05e', color: '#222', borderRadius: 4, padding: '2px 8px', textDecoration: 'line-through', fontWeight: 700, fontSize: 15 }}>₹{product.oldPrice}</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/cart'}
          style={{ marginTop: 16, width: '100%', background: '#fff0f6', color: '#d53f8c', border: '1px solid #fbb6ce', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
        >
          Go to Cart &rarr;
        </button>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        hideProgressBar: true,
        style: { minWidth: 300, borderRadius: 12, boxShadow: '0 2px 12px #0001' },
        icon: '✅',
      }
    );
  };

  const handleAddToCart = async (product) => {
    // Use the user from AuthContext instead of localStorage
    if (!isAuthenticated || !user) {
      alert('Please login to add to cart');
      navigate('/login');
      return;
    }
    
    // Get user ID (handle both id and _id formats)
    const userId = user.id || user._id;
    
    if (!userId) {
      console.error('User ID not found in user object:', user);
      alert('User ID not found. Please try logging in again.');
      return;
    }
    
    try {
      await axios.post('http://localhost:5001/api/cart/add', {
        user_id: userId,
        product_id: product.id || product._id,
        quantity: 1
      });
      addToCart(product);
      showAddToCartPopup(product);
    } catch (err) {
      console.error('Add to cart error:', err);
      
      // Check if the error is due to authentication
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to add to cart');
      }
    }
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

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const matchesLocation = !selectedLocation || product.location === selectedLocation;
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLocation && matchesPrice && matchesSearch;
  });

  return (
    <>
      <ToastContainer />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("Available Products")}</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <SlidersHorizontal size={20} />
            {t("Filters")}
          </button>
        </div>

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
            <div key={product._id || product.id} className="relative flex flex-col items-center bg-white rounded-2xl shadow-xl p-6 w-72 mx-auto">
              {/* Product Image */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <img
                  src={product.image_url || product.imageUrl || product.image || 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image'}
                  onError={(e) => (e.target.src = 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image')}
                  alt={product.name}
                  className="w-28 h-28 object-cover rounded-full shadow-lg border-4 border-white"
                  style={{ background: '#fff' }}
                />
              </div>
              {/* Card Content */}
              <div className="mt-16 text-center w-full">
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
                    className="flex-1 border-2 border-green-600 text-green-600 font-semibold rounded-lg px-4 py-2 transition hover:bg-green-50"
                  >
                    {t("Add to Cart")}
                  </button>
                  <button
                    onClick={() => navigate('/delivery-address', { state: { product } })}
                    className="flex-1 bg-green-600 text-white font-semibold rounded-lg px-4 py-2 transition hover:bg-green-700"
                  >
                    {t("Buy Now")}
                  </button>
                </div>
                {/* Contact and WhatsApp Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDirectMessage(product.sellerPhone)}
                    className="flex-1 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 transition hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!product.sellerPhone}
                  >
                    <Phone size={18} />
                    {t("Contact")}
                  </button>
                  <button
                    onClick={() => handleWhatsAppClick(product.sellerPhone)}
                    className="flex-1 bg-green-500 text-white font-semibold rounded-lg px-4 py-2 transition hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default BuyerDashboard;
