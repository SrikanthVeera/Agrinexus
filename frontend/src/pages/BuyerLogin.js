// src/pages/BuyerLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const BuyerLogin = () => {
  const { t } = useTranslation();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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
    setErrorMsg("");

    if (!loginIdentifier || !password) {
      setErrorMsg(t("Email/Phone and password are required"));
      return;
    }

    try {
      console.log("Attempting buyer login with:", { 
        [isEmail ? 'email' : 'phone']: loginIdentifier 
      });
      
      // Create request payload based on identifier type
      const loginPayload = {
        password,
        role: "Buyer" // 👈 sending role as buyer
      };
      
      // Add either email or phone to the payload
      if (isEmail) {
        loginPayload.email = loginIdentifier;
      } else {
        loginPayload.phone = loginIdentifier;
      }
      
      const res = await axios.post("http://localhost:5001/api/auth/login", loginPayload);

      console.log("Buyer Login successful:", res.data);

      // Check if the user is a buyer
      if (res.data.role !== "Buyer") {
        setErrorMsg(t("Access denied. This login is for buyers only."));
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      navigate("/buyer/dashboard");
    } catch (error) {
      console.error("Buyer Login failed:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        
        // If the server returned a requiredRole, redirect to the appropriate login page
        if (error.response.data.requiredRole) {
          const requiredRole = error.response.data.requiredRole;
          alert(t(`You are registered as a ${requiredRole}. Redirecting to the appropriate login page.`));
          
          switch (requiredRole) {
            case "Seller":
              navigate("/login/seller");
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
        
        if (error.response.status === 400 && error.response.data.message === "Invalid email or password") {
          setErrorMsg(t("Invalid email or password. Please try again or register a new account."));
        } else {
          setErrorMsg(error.response.data.message || t("Login failed. Please try again."));
        }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          {t("Buyer Login")}
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type={isEmail ? "email" : "tel"}
            placeholder={t("Email or Phone Number")}
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
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {t("Login")}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm mb-2">
            {t("Don't have an account?")}
          </p>
          <Link
            to="/register"
            state={{ defaultRole: "Buyer" }}
            className="block w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {t("Register as Buyer")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;
