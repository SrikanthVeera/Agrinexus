import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function SellerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Backend products state
  const [products, setProducts] = useState([]);

  // User from localStorage
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

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    location: "",
    imageUrl: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    // Check for both id and _id since the API might return either format
    const userId = storedUser && (storedUser.id || storedUser._id);
    
    if (storedUser && userId) {
      // Set authorization header for the request
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      console.log("Fetching profile for user ID:", userId);
      
      axios.get(`http://localhost:5001/api/auth/profile/${userId}`, config)
        .then(res => {
          console.log("Profile data received:", res.data);
          setUser({
            ...res.data,
            // Ensure we have the correct ID format for future requests
            id: res.data.id || userId
          });
        })
        .catch(err => {
          console.error("Error fetching profile:", err.response?.data || err.message);
          // Fallback to stored user data if API call fails
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

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
    } catch (err) {
      alert(t("Failed to fetch products"));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      
      // Create config with authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Use the correct user ID (either id or _id)
      const userId = user.id || user._id;
      
      console.log("Saving profile for user ID:", userId);
      
      const response = await axios.put(`http://localhost:5001/api/auth/profile/${userId}`, {
        phone: user.phone,
        location: user.location,
        upi: user.upi,
        gpay: user.gpay,
        phonepe: user.phonepe,
      }, config);
      
      console.log("Profile update response:", response.data);
      alert(t("Profile Saved Successfully!"));
      
      // Refresh the user data after saving
      const updatedUserData = {
        ...user,
        phone: user.phone,
        location: user.location,
        upi: user.upi,
        gpay: user.gpay,
        phonepe: user.phonepe,
      };
      
      // Update local state
      setUser(updatedUserData);
      
      // Update localStorage if needed
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        localStorage.setItem("user", JSON.stringify({
          ...storedUser,
          phone: user.phone
        }));
      }
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
      alert(t("Failed to save profile"));
    }
  };

  const handleEditProduct = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      location: product.location,
      imageUrl: product.imageUrl,
    });
    setEditProductId(product.id);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t("Are you sure to delete?"))) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(t("Failed to delete product"));
    }
  };

  const handleLogout = () => {
    // Call the logout function from AuthContext
    logout();
    // Navigate to the login page
    navigate('/login');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log("Form data:", form);
    console.log("User ID:", user.id);
    
    // Validate seller_id - ensure it's a valid number
    let sellerId = user.id;
    if (!sellerId || sellerId === '' || isNaN(parseInt(sellerId))) {
      console.warn("Invalid seller_id, using default value");
      // Use a default seller ID if the user ID is invalid
      sellerId = 1; // Default to ID 1 as fallback
    } else {
      // Convert to integer to ensure it's a number
      sellerId = parseInt(sellerId);
    }
    
    if (
      form.name &&
      form.price &&
      form.stock &&
      form.location &&
      form.imageUrl
    ) {
      try {
        const productData = {
          seller_id: sellerId, // Use the validated seller ID
          name: form.name,
          price: form.price,
          location: form.location,
          image_url: form.imageUrl,
          stock: form.stock,
          sellerPhone: user.phone // Include seller's phone number
        };
        
        console.log("Sending product data:", productData);
        
        if (editProductId) {
          // Update existing product
          console.log("Updating product with ID:", editProductId);
          const response = await axios.put(`http://localhost:5001/api/products/${editProductId}`, productData);
          console.log("Update response:", response.data);
          alert(t("Product updated successfully!"));
        } else {
          // Add new product
          console.log("Adding new product");
          try {
            const response = await axios.post("http://localhost:5001/api/products/add", productData);
            console.log("Add response:", response.data);
            alert(t("Product added successfully!"));
          } catch (error) {
            console.error("Error response:", error.response?.data);
            if (error.response?.data?.error) {
              alert(t(error.response.data.error));
            } else {
              alert(t("Failed to add product"));
            }
            throw error; // Re-throw to prevent form reset and modal close
          }
        }
        
        fetchProducts();
        setForm({
          name: "",
          price: "",
          stock: "",
          location: "",
          imageUrl: "",
        });
        setEditProductId(null);
        setShowModal(false);
      } catch (err) {
        alert(t("Failed to save product"));
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-96 bg-gradient-to-br from-blue-200 via-white to-green-200 shadow-2xl p-10 rounded-3xl border-2 border-blue-300 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-900 flex items-center gap-2">
          <User className="inline-block text-blue-500" size={28} /> {t("Seller Profile")}
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

        {/* Editable inputs */}
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
              onClick={() => { handleSaveProfile(); setEditingProfile(false); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow transition duration-200"
            >
              {t("Save Profile")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 w-full mt-8">
              <button
                onClick={() => setEditingProfile(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow transition duration-200"
              >
                {t("Edit Profile")}
              </button>
              <Link
                to="/bulk-order"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg shadow transition duration-200 text-center"
                style={{ display: 'block' }}
              >
                {t("Bulk Order")}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg shadow transition duration-200 flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                {t("Logout")}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold mb-4">{t("Your Products")}</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((p) => (
            <li key={p.id} className="relative flex flex-col items-center bg-white rounded-2xl shadow-xl p-6 w-72 mx-auto mb-16">
              {/* Product Image */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
                <img
                  src={p.image_url || p.imageUrl || 'https://dummyimage.com/150x150/cccccc/000000&text=No+Image'}
                  alt={p.name}
                  className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-white"
                  style={{ background: '#fff' }}
                />
              </div>
              {/* Card Content */}
              <div className="mt-20 text-center w-full">
                <div className="font-bold text-lg text-gray-800">{p.name}</div>
                <div className="text-gray-500 text-sm mb-1">{t("Stock:")} {p.stock} {t("units")}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-yellow-500 text-base">★ 4.5</span>
                  <span className="text-gray-700 font-semibold text-lg">|</span>
                  <span className="text-gray-800 font-bold text-lg">₹{p.price}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditProduct(p)}
                    className="flex-1 border-2 border-yellow-400 text-yellow-700 font-semibold rounded-lg px-4 py-2 transition hover:bg-yellow-50"
                  >
                    {t("Edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="flex-1 bg-red-500 text-white font-semibold rounded-lg px-4 py-2 transition hover:bg-red-600"
                  >
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setForm({ name: "", price: "", stock: "", location: "", imageUrl: "" });
            setEditProductId(null);
            setShowModal(true);
          }}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg shadow transition duration-200 max-w-xs mx-auto block"
        >
          {t("Add Product")}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editProductId ? t("Edit Product") : t("Add New Product")}
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder={t("Product Name")}
                className="border p-2 w-full rounded"
              />
              <input
                name="price"
                value={form.price}
                onChange={handleFormChange}
                placeholder={t("Price")}
                className="border p-2 w-full rounded"
              />
              <input
                name="stock"
                value={form.stock}
                onChange={handleFormChange}
                placeholder={t("Stock")}
                className="border p-2 w-full rounded"
              />
              <input
                name="location"
                value={form.location}
                onChange={handleFormChange}
                placeholder={t("Location")}
                className="border p-2 w-full rounded"
              />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
                placeholder={t("Image URL")}
                className="border p-2 w-full rounded"
              />

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {editProductId ? t("Update") : t("Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerPage;
