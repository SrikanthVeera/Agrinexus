import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useCartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

const EntrepreneurPage = () => {
  const { t } = useTranslation();
  const [leftoverProducts, setLeftoverProducts] = useState([]);
  const [bulkOrderProducts, setBulkOrderProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    phone: "",
    location: "",
    image: "",
    kg: "",
    price: "",
  });
  const { addToCart } = useCartContext();
  const [entrepreneurProducts, setEntrepreneurProducts] = useState([]);
  const [leftovers, setLeftovers] = useState([]);

  useEffect(() => {
    const fetchLeftovers = async () => {
      try {
        const baseUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5001";
        const res = await axios.get(`${baseUrl}/api/leftovers`);
        setLeftovers(res.data);
      } catch (err) {
        setLeftovers([]);
      }
    };
    const fetchBulkOrders = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
        const res = await axios.get(`${baseUrl}/api/bulk-orders`);
        setBulkOrderProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch bulk order products:", err.message);
      }
    };
    const fetchEntrepreneurProducts = async () => {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
      try {
        const res = await axios.get(`${baseUrl}/api/entrepreneur-products`);
        setEntrepreneurProducts(res.data);
      } catch (err) {
        setEntrepreneurProducts([]);
      }
    };
    fetchLeftovers();
    fetchBulkOrders();
    fetchEntrepreneurProducts();
    setLoading(false);
  }, []);

  // Function to handle buying a product
  const handleBuy = (product) => {
    alert(`You bought "${product.name}" for ₹${product.price}!`);
    // You can later add API call or cart logic here
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.phone || !newProduct.location || !newProduct.kg || !newProduct.price) {
      alert(t("Please fill all required fields"));
      return;
    }
    try {
      const productData = {
        ...newProduct,
        kg: parseInt(newProduct.kg),
        price: parseInt(newProduct.price),
        type: "entrepreneur"
      };
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
      await axios.post(`${baseUrl}/api/bulk-orders`, productData);
      setShowAddForm(false);
      setNewProduct({ name: "", phone: "", location: "", image: "", kg: "", price: "" });
      // Refresh product list
      const res = await axios.get(`${baseUrl}/api/bulk-orders`);
      setBulkOrderProducts(res.data);
      alert(t("Product added successfully!"));
    } catch (err) {
      alert(err.response?.data?.error || t("Failed to add product. Please try again."));
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
        type: 'entrepreneur'
      });

      // Add to frontend cart context
      addToCart({
        ...product,
        type: 'entrepreneur'
      });

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 text-center">
        {t("Meet Our Agri Entrepreneurs")}
      </h2>
      <div className="flex justify-center mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          onClick={() => navigate('/bulk-order')}
        >
          {t("Add Your Product (Entrepreneur/Company)")}
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t("Add New Product")}</h2>
            <input
              type="text"
              placeholder={t("Product Name")}
              className="w-full p-2 border rounded mb-2"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder={t("Phone Number")}
              className="w-full p-2 border rounded mb-2"
              value={newProduct.phone}
              onChange={e => setNewProduct({ ...newProduct, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder={t("Location")}
              className="w-full p-2 border rounded mb-2"
              value={newProduct.location}
              onChange={e => setNewProduct({ ...newProduct, location: e.target.value })}
            />
            <input
              type="number"
              placeholder={t("Quantity (kg)")}
              className="w-full p-2 border rounded mb-2"
              value={newProduct.kg}
              onChange={e => setNewProduct({ ...newProduct, kg: e.target.value })}
            />
            <input
              type="number"
              placeholder={t("Price per kg")}
              className="w-full p-2 border rounded mb-2"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder={t("Image URL")}
              className="w-full p-2 border rounded mb-2"
              value={newProduct.image}
              onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {t("Add Product")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entrepreneur Banner Slider */}
      <div className="overflow-hidden relative w-full h-[35rem] sm:h-[40rem] mb-10 bg-green-100 rounded-xl shadow-md">
        <motion.div
          className="flex"
          animate={{ x: [0, `-${100 * entrepreneurProducts.length}%`] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: entrepreneurProducts.length * 20,
            ease: "linear",
          }}
        >
          {entrepreneurProducts.map((e, index) => (
            <div
              key={index}
              className="min-w-full flex justify-center items-center flex-shrink-0 p-6"
            >
              <div className="flex flex-col items-center gap-4 bg-white rounded-xl shadow-lg p-6 w-[90%]">
                <img
                  src={e.image}
                  alt={e.name}
                  className="w-full h-64 md:h-80 object-cover rounded-xl"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-green-800">
                    {e.name}
                  </h3>
                  <p className="text-lg text-gray-600">{e.product}</p>
                  <p className="text-gray-500">{e.location}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bulk Order Products Section */}
      <h3 className="text-2xl font-bold text-green-600 mb-8 text-center">
        {t("Bulk Order Products")}
      </h3>

      {loading ? (
        <p className="text-gray-500">{t("Loading products...")}</p>
      ) : (
        error && <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entrepreneurProducts.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center py-16">
            <img src="https://dummyimage.com/200x200/cccccc/000000&text=No+Products" alt="No Products" className="mb-6" />
            <p className="text-xl text-gray-500 mb-2">No entrepreneur products available.</p>
            <p className="text-gray-400">Please check back later or add a new product.</p>
          </div>
        ) : (
          entrepreneurProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <img src={product.image || "https://dummyimage.com/150x150/cccccc/000000&text=No+Image"} alt={product.name} className="w-32 h-32 object-cover rounded mb-4" />
              <div className="font-bold text-lg mb-2">{product.name}</div>
              <div className="text-gray-600 mb-1">{product.location}</div>
              <div className="text-green-700 font-semibold mb-2">₹{product.price}{product.kg ? ` / ${product.kg}kg` : ''}</div>
              <button onClick={() => handleAddToCart(product)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                <ShoppingCart size={18} /> {t("Add to Cart")}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Leftover Stock Section */}
      <h3 className="text-2xl font-bold text-orange-600 mb-8 text-center">{t("Leftover Stock (from Farmers)")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {leftovers.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center justify-center py-12">
            <img src="https://dummyimage.com/200x200/cccccc/000000&text=No+Leftovers" alt="No Leftovers" className="mb-6" />
            <p className="text-xl text-gray-500 mb-2">No leftover stock available.</p>
            <p className="text-gray-400">Farmers haven't listed any leftovers yet.</p>
          </div>
        ) : (
          leftovers.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <img src={item.image || "https://dummyimage.com/150x150/cccccc/000000&text=No+Image"} alt={item.name} className="w-32 h-32 object-cover rounded mb-4" />
              <div className="font-bold text-lg mb-2">{item.name}</div>
              <div className="text-gray-600 mb-1">{item.location}</div>
              <div className="text-green-700 font-semibold mb-2">₹{item.price} / {item.quantity}kg</div>
              <button onClick={() => handleAddToCart({ ...item, type: 'leftover', product_id: item.id })} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2">
                <ShoppingCart size={18} /> {t("Add to Cart")}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EntrepreneurPage;
