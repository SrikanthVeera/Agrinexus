import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AdminRegister = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password } = formData;
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError(t("All fields are required."));
      return;
    }
    
    // Validate phone number (simple validation)
    if (!/^\d{10}$/.test(phone.trim())) {
      setError(t("Please enter a valid 10-digit phone number."));
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (res.data.message === "User registered successfully") {
        alert(t("Admin registration successful!"));
        navigate("/admin/login");
      } else {
        setError(res.data.message || t("Registration failed"));
      }
    } catch (err) {
      setError(err.response?.data?.message || t("Registration failed."));
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
          {t("Register as Admin")}
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("Full Name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={t("Admin Name")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("Email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={t("admin@example.com")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("Phone Number")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={t("10-digit phone number")}
              maxLength="10"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">{t("Password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={t("********")}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"} text-white py-2 rounded font-semibold`}
          >
            {loading ? t("Registering...") : t("Register as Admin")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("Already have an admin account?")} {" "}
          <Link to="/admin/login" className="text-purple-700 hover:underline font-medium">
            {t("Login here")}
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/register" className="text-gray-600 hover:underline">
            {t("Register as a different user type")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;