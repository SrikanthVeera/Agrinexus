import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const DeliveryLogin = () => {
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
        role: "DeliveryPartner", // 👈 role sent as delivery
      });

      console.log("Delivery Login successful:", res.data);

      // Check if the user is a delivery partner
      if (res.data.role !== "DeliveryPartner") {
        setErrorMsg(t("Access denied. This login is for delivery partners only."));
        return;
      }

      // ✅ Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // ✅ Navigate to delivery dashboard
      navigate("/delivery-partner");
    } catch (error) {
      console.error(
        "Delivery Login failed:",
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
          case "Entrepreneur":
            navigate("/login/entrepreneur");
            break;
          default:
            navigate("/login");
        }
        return;
      }
      
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(t("Invalid credentials. Please try again."));
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
          {t("Delivery Login")}
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
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {t("Login")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("Don't have an account?")} {" "}
          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            {t("Register here")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DeliveryLogin;
