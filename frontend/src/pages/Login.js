import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to detect if input is email or phone
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setLoginIdentifier(value);
    
    // Check if input looks like an email (contains @)
    setIsEmail(value.includes('@'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!loginIdentifier || !password) {
      setError(t("Login identifier and password are required"));
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { 
        [isEmail ? 'email' : 'phone']: loginIdentifier 
      });
      
      // First, check if the user exists and get their role
      const checkRes = await axios.post(
        "http://localhost:5001/api/auth/login",
        isEmail 
          ? { email: loginIdentifier, password }
          : { phone: loginIdentifier, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Login response:", checkRes.data);
      
      if (checkRes.data.token) {
        const userRole = checkRes.data.role;
        
        // Redirect to the appropriate login page based on role
        switch (userRole) {
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
            // If no specific role or unknown role, proceed with general login
            localStorage.setItem("token", checkRes.data.token);
            const { user } = checkRes.data;

            // Save user properly with all details
            localStorage.setItem(
              "user",
              JSON.stringify({
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar || "",
                token: checkRes.data.token,
              })
            );

            login(user); // Update global auth context

            // Navigate based on user role
            const role = user.role?.toLowerCase();
            switch (role) {
              case "buyer":
                navigate("/buyer/dashboard");
                break;
              case "seller":
                navigate("/farmer/dashboard");
                break;
              case "delivery partner":
              case "deliverypartner":
                navigate("/delivery-partner");
                break;
              case "entrepreneur":
                navigate("/entrepreneur-details");
                break;
              case "admin":
                navigate("/admin");
                break;
              default:
                navigate("/");
            }
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(err.response.data.message || t("Login failed. Please try again."));
      } else if (err.request) {
        console.error("Error request:", err.request);
        setError(t("No response from server. Please try again later."));
      } else {
        console.error("Error message:", err.message);
        setError(t("Login failed. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {t("Login to AgroTech Nexus")}
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {t("Email or Phone Number")}
            </label>
            <input
              type={isEmail ? "email" : "tel"}
              value={loginIdentifier}
              onChange={handleIdentifierChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("Enter your email or phone number")}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {isEmail 
                ? t("Using email for login") 
                : t("Using phone number for login")}
            </p>
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {t("Password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("Enter your password")}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 rounded transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? t("Logging in...") : t("Login")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t("Don't have an account?")}{" "}
          <Link
            to="/register"
            className="text-green-700 hover:underline font-medium"
          >
            {t("Register here")}
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          <Link
            to="/admin/login"
            className="text-purple-700 hover:underline font-medium"
          >
            {t("Admin Login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
