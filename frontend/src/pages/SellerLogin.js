// src/pages/SellerLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../context/AuthContext";

const SellerLogin = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if already logged in as a seller
  useEffect(() => {
    if (isAuthenticated && user && user.role === "Seller") {
      navigate("/farmer/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!email || !password) {
      setErrorMsg(t("Email and password are required"));
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting seller login with:", { email, role: "Seller" });
      
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
        role: "Seller",
      });

      console.log("Seller Login successful:", res.data);

      // Check if the user is a seller
      if (res.data.role !== "Seller") {
        setErrorMsg(t("Access denied. This login is for sellers only."));
        setLoading(false);
        return;
      }

      // Use the context login function instead of directly setting localStorage
      login(res.data.user, res.data.token);
      
      // Add a small delay before navigation to ensure context is updated
      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 100);
    } catch (error) {
      console.error("Seller Login failed:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        
        // If the server returned a requiredRole, redirect to the appropriate login page
        if (error.response.data.requiredRole) {
          const requiredRole = error.response.data.requiredRole;
          alert(t(`You are registered as a ${requiredRole}. Redirecting to the appropriate login page.`));
          
          switch (requiredRole) {
            case "Buyer":
              navigate("/login/buyer");
              break;
            case "DeliveryPartner":
              navigate("/delivery/login");
              break;
            case "Entrepreneur":
              navigate("/login/entrepreneur");
              break;
            default:
              navigate("/login");
          }
          return;
        }
        
        setErrorMsg(error.response.data.message || t("Invalid credentials. Please try again."));
      } else if (error.request) {
        console.error("Error request:", error.request);
        setErrorMsg(t("No response from server. Please try again later."));
      } else {
        console.error("Error message:", error.message);
        setErrorMsg(t("Login failed. Please try again."));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700">
          {t("Seller Login")}
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={t("Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded"
          />
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
            disabled={loading}
            className={`w-full ${loading ? 'bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-700'} text-white p-2 rounded transition-colors duration-200`}
          >
            {loading ? t("Logging in...") : t("Login")}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm mb-2">
            {t("Don't have an account?")}
          </p>
          <Link
            to="/register"
            state={{ defaultRole: "Seller" }}
            className="block w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            {t("Register as Seller")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
