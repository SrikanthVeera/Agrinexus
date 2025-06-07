import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [loginIdentifier, setLoginIdentifier] = useState("");
    const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Only allow email input
  const handleIdentifierChange = (e) => {
    setLoginIdentifier(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Hardcoded admin credentials
    const adminEmail = "srikanthveera160@gmail.com";
    const adminPassword = "sri@12345";

    try {
      // Only allow login for the hardcoded admin credentials
      if (loginIdentifier === adminEmail && password === adminPassword) {
        // Create a token manually (for demo purposes)
        const token = "admin-token-" + Date.now();
        // Create admin user object
        const adminUser = {
          _id: "admin-" + Date.now(),
          name: "Admin",
          email: adminEmail,
          role: "admin"
        };
        // Store admin user and admin flag in localStorage
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", "true");
        // Navigate to home page (or admin dashboard)
        navigate("/");
        return;
      } else {
        setErrorMsg(t("Access denied. Only the specified admin can login."));
        setLoading(false);
        return;
      }
    } catch (error) {
      setErrorMsg(t("Login failed. Please try again."));
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
            type="email"
            placeholder={t("Admin Email")}
            value={loginIdentifier}
            onChange={handleIdentifierChange}
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;