import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../context/AuthContext";

const BuyerLogin = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setLoginIdentifier(value);
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
      const payload = { password, role: "Buyer" };
      if (isEmail) payload.email = loginIdentifier;
      else payload.phone = loginIdentifier;

      const res = await axios.post("http://localhost:5001/api/auth/login", payload);
      console.log("Buyer Login successful:", res.data);

      if (res.data.role !== "Buyer") {
        setErrorMsg(t("Access denied. This login is for buyers only."));
        return;
      }

      login(res.data.user, res.data.token);
      navigate("/buyer/dashboard");
    } catch (error) {
      console.error("Buyer Login failed:", error);
      if (error.response) {
        const data = error.response.data;
        if (data.requiredRole) {
          alert(t(`You are registered as a ${data.requiredRole}. Redirecting...`));
          switch (data.requiredRole) {
            case "Seller": navigate("/login/seller"); return;
            case "DeliveryPartner": navigate("/delivery/login"); return;
            case "Entrepreneur": navigate("/login/entrepreneur"); return;
            default: navigate("/login"); return;
          }
        }
        setErrorMsg(data.message || t("Login failed. Please try again."));
      } else if (error.request) {
        setErrorMsg(t("No response from server. Please try again later."));
      } else {
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
            {isEmail ? t("Using email for login") : t("Using phone number for login")}
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
          <p className="text-sm mb-2">{t("Don't have an account?")}</p>
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