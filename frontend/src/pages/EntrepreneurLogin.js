// src/pages/EntrepreneurLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const EntrepreneurLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
        role: "Entrepreneur",
      });

      console.log("Entrepreneur Login successful:", res.data);

      // Check if the user is an entrepreneur
      if (res.data.role !== "Entrepreneur") {
        setErrorMsg(t("Access denied. This login is for entrepreneurs only."));
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      navigate("/entrepreneur-details");
    } catch (error) {
      console.error(
        "Entrepreneur Login failed:",
        error.response?.data || error.message
      );
      
      // If the server returned a requiredRole, redirect to the appropriate login page
      if (error.response?.data?.requiredRole) {
        const requiredRole = error.response.data.requiredRole;
        alert(t(`You are registered as a ${requiredRole}. Redirecting to the appropriate login page.`));
        
        switch (requiredRole) {
          case "Seller":
            navigate("/login/seller");
            break;
          case "Buyer":
            navigate("/login/buyer");
            break;
          case "DeliveryPartner":
            navigate("/delivery/login");
            break;
          default:
            navigate("/login");
        }
        return;
      }
      
      setErrorMsg(
        error.response?.data?.message || t("Invalid credentials. Please try again.")
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">
          {t("Entrepreneur Login")}
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
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            {t("Login")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("Don't have an account?")} {" "}
          <Link
            to="/register"
            className="text-purple-700 font-semibold hover:underline"
          >
            {t("Register here")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EntrepreneurLogin;
