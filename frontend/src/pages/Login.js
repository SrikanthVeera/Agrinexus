import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Lock } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  
  // Get role from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role) {
      setSelectedRole(role);
    }
  }, [location]);

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
      
      // Create login payload with selected role if available
      const loginPayload = {
        password,
        role: selectedRole || null // Use selected role if available, otherwise null
      };
      
      // Add either email or phone to the payload
      if (isEmail) {
        loginPayload.email = loginIdentifier;
      } else {
        loginPayload.phone = loginIdentifier;
      }
      
      // First, check if the user exists and get their role
      const checkRes = await axios.post(
        "http://localhost:5001/api/auth/login",
        loginPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Login response:", checkRes.data);
      
      if (checkRes.data.token) {
        // Store token and user data
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

        // Update global auth context
        login(user, checkRes.data.token);

        // Navigate based on user role
        const role = user.role?.toLowerCase();
        console.log("User role:", role);
        
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700 flex items-center justify-center gap-2">
          <User className="text-green-600" />
          {t("Login to AgroTech Nexus")}
        </h2>
        
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center font-medium p-3 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
              <User className="h-4 w-4 text-green-600" />
              {t("Select Your Role")}
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
            >
              <option value="">{t("Select a role (optional)")}</option>
              <option value="Seller">{t("Farmer/Seller")}</option>
              <option value="Buyer">{t("Buyer")}</option>
              <option value="DeliveryPartner">{t("Delivery Partner")}</option>
              <option value="Entrepreneur">{t("Entrepreneur")}</option>
            </select>
          </div>
          
          {/* Email/Phone Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
              {isEmail ? 
                <Mail className="h-4 w-4 text-green-600" /> : 
                <Phone className="h-4 w-4 text-green-600" />
              }
              {t("Email or Phone Number")}
            </label>
            <div className="relative">
              <input
                type={isEmail ? "email" : "tel"}
                value={loginIdentifier}
                onChange={handleIdentifierChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={t("Enter your email or phone number")}
                required
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                {isEmail 
                  ? <Mail className="h-3 w-3" /> 
                  : <Phone className="h-3 w-3" />
                }
                {isEmail 
                  ? t("Using email for login") 
                  : t("Using phone number for login")}
              </p>
            </div>
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-1">
              <Lock className="h-4 w-4 text-green-600" />
              {t("Password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder={t("Enter your password")}
              required
            />
          </div>
          
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                {t("Logging in...")}
              </>
            ) : (
              t("Login")
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            {t("Don't have an account?")}{" "}
            <Link
              to="/register"
              className="text-green-700 hover:underline font-medium"
            >
              {t("Register here")}
            </Link>
          </p>
          
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              to="/login?role=Seller"
              className={`text-sm px-3 py-1 rounded-full ${selectedRole === 'Seller' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t("Farmer Login")}
            </Link>
            <Link
              to="/login?role=Buyer"
              className={`text-sm px-3 py-1 rounded-full ${selectedRole === 'Buyer' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t("Buyer Login")}
            </Link>
            <Link
              to="/admin/login"
              className="text-sm px-3 py-1 rounded-full text-purple-700 hover:bg-purple-50"
            >
              {t("Admin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
