import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get default role from location state if available
  const defaultRole = location.state?.defaultRole || "Buyer";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: defaultRole,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, role } = formData;
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !role.trim()) {
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
        alert(t("Registration successful!"));
        
        // Redirect to the appropriate login page based on role
        const role = res.data.role;
        switch (role) {
          case "Seller":
            navigate("/login/seller");
            break;
          case "Buyer":
            navigate("/login/buyer");
            break;
          case "DeliveryPartner":
            navigate("/delivery/login");
            break;
          case "Entrepreneur":
            navigate("/login/entrepreneur");
            break;
          case "admin":
            navigate("/admin/login");
            break;
          default:
            navigate("/login");
        }
      } else {
        setError(res.data.message || t("Registration failed"));
      }
    } catch (err) {
      let errorMessage = t("Registration failed.");
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === "ECONNABORTED") {
        errorMessage = t("Request timed out. Please try again.");
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          {t("Create Your Account")}
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
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("John Doe")}
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
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("example@mail.com")}
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
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("10-digit phone number")}
              maxLength="10"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("Password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("********")}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              {t("Register As")}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="Buyer">{t("Buyer")}</option>
              <option value="Seller">{t("Seller")}</option>
              <option value="DeliveryPartner">{t("Delivery Partner")}</option>
              <option value="Entrepreneur">{t("Entrepreneur")}</option>
              <option value="admin">{t("Admin")}</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"} text-white py-2 rounded font-semibold`}
          >
            {loading ? t("Registering...") : t("Register")}
          </button>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              type="button"
              onClick={() => window.location.href = `http://localhost:5001/api/auth/google?redirect_uri=${encodeURIComponent(window.location.origin + '/oauth-callback')}`}
              className="hover:scale-110 transition-transform"
              title={t("Sign up with Google")}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={() => window.location.href = `http://localhost:5001/api/auth/facebook?redirect_uri=${encodeURIComponent(window.location.origin + '/oauth-callback')}`}
              className="hover:scale-110 transition-transform"
              title={t("Sign up with Facebook")}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-7 h-7" />
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("Already have an account?")} {" "}
          <Link to="/login" className="text-green-700 hover:underline font-medium">
            {t("Login here")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
