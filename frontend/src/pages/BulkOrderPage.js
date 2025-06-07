import React, { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingCart, MessageCircle, Phone, User, Mail, MapPin } from "lucide-react";
import { useCartContext } from "../context/CartContext";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BulkOrderPage = () => {
  const { t } = useTranslation();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  // Sidebar user state
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        location: storedUser.location || "",
      });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveProfile = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      })
    );
    alert(t("Profile Saved Successfully!"));
  };

  // BulkOrderPage-specific products state (with localStorage persistence)
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    phone: "",
    location: "",
    image: "",
    kg: "",
    price: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Tamil Nadu districts for filter
  const TAMIL_NADU_DISTRICTS = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  // Filter state
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  // Collapsible filter state
  const [showCommodityFilter, setShowCommodityFilter] = useState(true);
  const [showDistrictFilter, setShowDistrictFilter] = useState(true);
  const [showPriceFilter, setShowPriceFilter] = useState(true);

  // Price filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Filtered products
  const filteredProducts = products.filter(product => {
    const commodityMatch = selectedCommodities.length === 0 || selectedCommodities.includes(product.name);
    const districtMatch = selectedDistricts.length === 0 || selectedDistricts.includes(product.location);
    const price = parseFloat(product.price);
    const minOk = minPrice === "" || price >= parseFloat(minPrice);
    const maxOk = maxPrice === "" || price <= parseFloat(maxPrice);
    return commodityMatch && districtMatch && minOk && maxOk;
  });

  // Handle filter changes
  const handleCommodityChange = (name) => {
    setSelectedCommodities(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };
  const handleDistrictChange = (district) => {
    setSelectedDistricts(prev => prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/bulk-orders');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.phone || !newProduct.location || !newProduct.kg || !newProduct.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const entrepreneurId = storedUser && (storedUser.id || storedUser._id);
      const productData = {
        ...newProduct,
        kg: parseInt(newProduct.kg),
        price: parseInt(newProduct.price),
        entrepreneur_id: entrepreneurId
      };

      const res = await axios.post('http://localhost:5001/api/bulk-orders', productData);
      
      if (res.data) {
        setProducts([...products, res.data]);
        setNewProduct({
          name: "",
          phone: "",
          location: "",
          image: "",
          kg: "",
          price: "",
        });
        setShowAddForm(false);
        alert("Product added successfully!");
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      alert(err.response?.data?.error || 'Failed to add product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!id) {
      alert('Invalid product ID');
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:5001/api/bulk-orders/${id}`);
      if (res.data.success) {
        setProducts(products.filter((product) => product.id !== id));
        alert('Product deleted successfully!');
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert(err.response?.data?.error || 'Failed to delete product. Please try again.');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert(t("Please login to add items to cart"));
        navigate('/login');
        return;
      }

      // Add to backend cart
      await axios.post('http://localhost:5001/api/cart/add', {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
        type: 'bulk_order'
      });

      // Add to frontend cart context
      const cartProduct = {
        ...product,
        id: product.id || product._id || `${product.name}-${product.location}-${product.price}`,
        type: 'bulk_order'
      };
      console.log('Adding to cart:', cartProduct);
      addToCart(cartProduct);

      // Show success message
      toast.success(
        <div style={{ minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={product.image || "https://dummyimage.com/60x60/cccccc/000000&text=No+Image"} alt={product.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 600 }}>{product.name}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{product.kg ? `${product.kg} kg` : ''} ×1</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ background: '#e53e3e', color: '#fff', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontSize: 15 }}>₹{product.price}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button
              onClick={() => navigate('/cart')}
              style={{ flex: 1, background: '#fff0f6', color: '#d53f8c', border: '1px solid #fbb6ce', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
            >
              View Cart
            </button>
            <button
              onClick={() => toast.dismiss()}
              style={{ flex: 1, background: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: false,
          hideProgressBar: true,
          style: { minWidth: 300, borderRadius: 12, boxShadow: '0 2px 12px #0001' },
          icon: '✅',
        }
      );

    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error(t("Failed to add item to cart. Please try again."));
    }
  };

  const handleWhatsAppClick = (phone) => {
    const message = "Hello, I'm interested in your product. Can you provide more details?";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDirectMessage = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Filters */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-xl font-bold mb-6">{t("Filter Bulk Orders")}</h3>
        {/* Commodity Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCommodityFilter(v => !v)}>
            <label className="block font-semibold mb-2">{t("Select Commodity")}</label>
            <span>{showCommodityFilter ? "▲" : "▼"}</span>
          </div>
          {showCommodityFilter && (
            <div>
              {Array.from(new Set(products.map(p => p.name))).map((name, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input type="checkbox" id={`commodity-${name}`} className="mr-2" checked={selectedCommodities.includes(name)} onChange={() => handleCommodityChange(name)} />
                  <label htmlFor={`commodity-${name}`}>{name}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* District Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDistrictFilter(v => !v)}>
            <label className="block font-semibold mb-2">{t("Select District (Tamil Nadu)")}</label>
            <span>{showDistrictFilter ? "▲" : "▼"}</span>
          </div>
          {showDistrictFilter && (
            <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50">
              {TAMIL_NADU_DISTRICTS.map((district, idx) => (
                <div key={idx} className="flex items-center mb-1">
                  <input type="checkbox" id={`district-${district}`} className="mr-2" checked={selectedDistricts.includes(district)} onChange={() => handleDistrictChange(district)} />
                  <label htmlFor={`district-${district}`}>{district}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Price Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowPriceFilter(v => !v)}>
            <label className="block font-semibold mb-2">{t("Price Range")}</label>
            <span>{showPriceFilter ? "▲" : "▼"}</span>
          </div>
          {showPriceFilter && (
            <div className="flex gap-2 items-center mt-2">
              <input
                type="number"
                className="border p-1 rounded w-20"
                placeholder={t("Min")}
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                className="border p-1 rounded w-20"
                placeholder={t("Max")}
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t("Upcoming Bulk Orders")}</h2>
          <div className="flex gap-2">
            <button onClick={fetchProducts} className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600">{t("Refresh")}</button>
            <button onClick={() => setShowAddForm(true)} className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 flex items-center gap-1"><Plus size={18} />{t("Add Product")}</button>
          </div>
        </div>
        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{t("Add New Product")}</h2>
              <div className="space-y-4">
                <input type="text" placeholder={t("Product Name")} className="w-full p-2 border rounded" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input type="tel" placeholder={t("Phone Number")} className="w-full p-2 border rounded" value={newProduct.phone} onChange={e => setNewProduct({ ...newProduct, phone: e.target.value })} />
                <select className="w-full p-2 border rounded" value={newProduct.location} onChange={e => setNewProduct({ ...newProduct, location: e.target.value })}>
                  <option value="">{t("Select District")}</option>
                  {TAMIL_NADU_DISTRICTS.map((district, idx) => (
                    <option key={idx} value={district}>{district}</option>
                  ))}
                </select>
                <input type="number" placeholder={t("Quantity (kg)")} className="w-full p-2 border rounded" value={newProduct.kg} onChange={e => setNewProduct({ ...newProduct, kg: e.target.value })} />
                <input type="number" placeholder={t("Price per kg")} className="w-full p-2 border rounded" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                <input type="text" placeholder={t("Image URL")} className="w-full p-2 border rounded" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border rounded hover:bg-gray-100">{t("Cancel")}</button>
                  <button onClick={handleAddProduct} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t("Add Product")}</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
              <img src={product.image || 'https://dummyimage.com/80x80/cccccc/000000&text=No+Image'} alt={product.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-700 font-semibold uppercase tracking-wide">{t("Bulk Order")}</span>
                  <span className="text-gray-400 text-xs">#{product.id}</span>
                </div>
                <div className="font-bold text-lg">{product.name}</div>
                <div className="text-gray-600 text-sm mb-1">{product.kg} kg | ₹{product.price} per kg</div>
                <div className="text-gray-500 text-xs">{product.location}</div>
                <div className="text-gray-500 text-xs">{t("Contact")}: {product.phone}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleAddToCart(product)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm flex items-center gap-1"><ShoppingCart size={16} />{t("Add to Cart")}</button>
                <button onClick={() => handleWhatsAppClick(product.phone)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center gap-1"><MessageCircle size={16} />{t("WhatsApp")}</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center gap-1"><Trash2 size={16} />{t("Delete")}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkOrderPage;
