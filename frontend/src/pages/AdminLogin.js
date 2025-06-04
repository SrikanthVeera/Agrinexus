import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Function to detect if input is email or phone
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setLoginIdentifier(value);
    
    // Check if input looks like an email (contains @)
    setIsEmail(value.includes('@'));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Hardcoded admin credentials
    const adminEmail = "srikanthveera0912@gmail.com";
    const adminPhone = "9876543211";
    const adminPassword = "Srikanth@000";

    try {
      // For the hardcoded admin credentials, bypass backend authentication
      if ((isEmail && loginIdentifier === adminEmail) || (!isEmail && loginIdentifier === adminPhone)) {
        if (password === adminPassword) {
          // Create a token manually (this is just for demo purposes)
          const token = "admin-token-" + Date.now();
          
          // Create admin user object
          const adminUser = {
            _id: "admin-" + Date.now(),
            name: "Srikanth Admin",
            email: adminEmail,
            phone: adminPhone,
            role: "admin"
          };

          // Store admin user in localStorage
          localStorage.setItem("user", JSON.stringify(adminUser));
          localStorage.setItem("token", token);
          
          // Navigate to admin dashboard
          navigate("/admin");
          return;
        }
      }
      
      // If not using hardcoded admin, try regular authentication
      const loginPayload = {
        password,
        role: "admin"
      };
      
      // Add either email or phone to the payload
      if (isEmail) {
        loginPayload.email = loginIdentifier;
      } else {
        loginPayload.phone = loginIdentifier;
      }
      
      const res = await axios.post("http://localhost:5001/api/auth/login", loginPayload);

      // If login is successful, check if user is admin
      if (res.data && res.data.user && res.data.user.role === "admin") {
        // Store admin user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        
        // Navigate to admin dashboard
        navigate("/admin");
      } else {
        setErrorMsg(t("Access denied. Admin privileges required."));
      }
    } catch (error) {
      console.error("Admin Login failed:", error);
      
      if (error.response) {
        setErrorMsg(error.response.data.message || t("Login failed"));
      } else if (error.request) {
        setErrorMsg(t("No response from server. Please try again later."));
      } else {
        setErrorMsg(t("Login failed. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">
          {t("Admin Login")}
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type={isEmail ? "email" : "tel"}
            placeholder={t("Admin Email or Phone")}
            value={loginIdentifier}
            onChange={handleIdentifierChange}
            required
            className="w-full mb-4 p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mb-4">
            {isEmail 
              ? t("Using email for login") 
              : t("Using phone number for login")}
          </p>
          <input
            type="password"
            placeholder={t("Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded"
          />
          {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? t("Logging in...") : t("Login as Admin")}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {t("This page is for administrators only.")}
          </p>
          <p className="text-sm">
            {t("Don't have an admin account?")} {" "}
            <Link to="/admin/register" className="text-purple-700 hover:underline font-medium">
              {t("Register here")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;