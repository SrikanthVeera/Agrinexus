import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaTruck,
  FaBoxOpen,
  FaMicrophone,
  FaCamera,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex flex-wrap justify-between items-center px-6 py-2 border-b text-sm text-gray-700">
        {/* Logo and Search */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex items-center space-x-2">
            {location.pathname !== "/" && (
              <img
                src="https://th.bing.com/th/id/OIP.cLAYh1w0bhi8OYBGTAJANgHaI9?rs=1&pid=ImgDetMain"
                alt="Logo"
                className="h-10 w-auto"
              />
            )}
            <span className="font-bold text-xl tracking-wide text-green-700">
              AgroTech Nexus
            </span>
          </div>

          <div className="flex items-center border border-gray-300 rounded overflow-hidden w-full max-w-md ml-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-3 py-2 w-full outline-none text-sm"
            />
            <button className="px-2 text-gray-600 hover:text-green-600 transition-transform hover:scale-110">
              <FaMicrophone />
            </button>
            <button className="px-2 text-gray-600 hover:text-green-600 transition-transform hover:scale-110">
              <FaCamera />
            </button>
            <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-4 py-2 shadow-md rounded transition-transform hover:scale-105">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Nav Icons + Profile/Login */}
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <Link
            to="/cart"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white shadow hover:scale-105 hover:from-green-500 hover:to-blue-500 transition-transform duration-200"
          >
            <FaShoppingCart />
            <span>Cart</span>
          </Link>

          <Link
            to="/track-order"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow hover:scale-105 hover:from-yellow-500 hover:to-pink-500 transition-transform duration-200"
          >
            <FaTruck />
            <span>Track Order</span>
          </Link>

          <Link
            to="/bulk-order"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow hover:scale-105 hover:from-purple-500 hover:to-indigo-500 transition-transform duration-200"
          >
            <FaBoxOpen />
            <span>Bulk Order</span>
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1 rounded shadow hover:scale-105 hover:from-green-700 hover:to-blue-700 transition-transform duration-200"
              >
                <FaUserCircle className="text-xl" />
                {user?.name?.split(" ")[0] || "Profile"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-1 rounded shadow transition-transform hover:scale-105">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-green-700 text-white text-sm font-medium px-6 py-2 flex flex-wrap justify-center gap-8">
        <Link to="/" className="hover:underline hover:text-yellow-200 transition-colors duration-200">Home</Link>
        <Link to="/about" className="hover:underline hover:text-yellow-200 transition-colors duration-200">About</Link>
        <Link to="/customer-details" className="hover:underline hover:text-yellow-200 transition-colors duration-200">Customer</Link>
        <Link to="/farmer-details" className="hover:underline hover:text-yellow-200 transition-colors duration-200">Farmer</Link>
        <Link to="/service" className="hover:underline hover:text-yellow-200 transition-colors duration-200">Services</Link>
      </div>
    </header>
  );
};

export default Header;
