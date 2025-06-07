import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Truck,
  PackageSearch,
  UserCircle2,
  Mic,
  Camera,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Webcam from "react-webcam";
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { cart } = useCartContext();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const username = user?.name?.split(" ")[0] || "Guest";
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleVoiceSearch = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });
  };

  const handleVoiceEnd = () => {
    SpeechRecognition.stopListening();
    setSearch(transcript);
  };

  const handleCameraClick = () => {
    setShowImageOptions(true);
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSearch("Potato"); // mock recognition result
    }
    setShowImageOptions(false);
  };

  const captureImage = () => {
    // eslint-disable-next-line no-unused-vars
    const imageSrc = webcamRef.current.getScreenshot();
    setShowWebcam(false);
    setSearch("Tomato"); // mock recognition result
  };

  const handleProfileClick = () => {
    navigate(user ? "/profile" : "/login");
  };

  // Language switcher
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-white border-b shadow-sm sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="https://th.bing.com/th/id/OIP.cLAYh1w0bhi8OYBGTAJANgHaI9?rs=1&pid=ImgDetMain"
          alt="Logo"
          className="h-8 w-8 rounded-full object-cover shadow-lg animate-bounce-slow"
        />
        <span className="text-2xl font-bold text-green-700 tracking-wide animate-fade-in">AgroTech Nexus</span>
      </div>

      {/* Search */}
      <div className="flex items-center mt-2 sm:mt-0 sm:mx-4 w-full sm:w-1/3 relative">
        <input
          type="text"
          placeholder={t('Search products...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow px-4 py-1 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <button
          className={`px-2 border-y border-gray-300 bg-white transition hover:bg-green-100 ${listening ? "bg-green-100" : ""}`}
          onClick={handleVoiceSearch}
          onMouseUp={handleVoiceEnd}
          aria-label="Mic"
        >
          <Mic className="h-5 w-5 text-gray-600" />
        </button>
        <button
          className="px-2 border-y border-r border-gray-300 bg-white transition hover:bg-blue-100"
          onClick={handleCameraClick}
          aria-label="Camera"
        >
          <Camera className="h-5 w-5 text-gray-600" />
        </button>
        <button
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-r-md shadow-md hover:scale-105 transition-transform duration-200"
          aria-label="Search"
          onClick={() => {
            if (search.trim()) {
              navigate(`/search?query=${encodeURIComponent(search)}`);
            }
          }}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Image Options Modal */}
      {showImageOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-sm space-y-4">
            <button
              onClick={() => setShowImageOptions(false)}
              className="absolute top-2 right-2"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
            <h2 className="text-lg font-semibold text-center mb-2">
              Select an Option
            </h2>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              📤 Upload Image
            </button>
            <button
              onClick={() => {
                setShowImageOptions(false);
                setShowWebcam(true);
              }}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📸 Take Picture
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleUploadImage}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Webcam Modal */}
      {showWebcam && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setShowWebcam(false)}
              className="absolute top-2 right-2"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg w-full"
            />
            <button
              onClick={captureImage}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Capture & Recognize
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <ul className="flex space-x-2 items-center mt-2 sm:mt-0 text-xs">
        {location.pathname.startsWith('/farmer/dashboard') ? (
          <>
            <li>
              <Link to="/market-price" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-500 to-blue-500 text-white shadow hover:scale-110 hover:from-green-600 hover:to-blue-600 transition-transform duration-200">
                <span className="mr-1">📈</span> {t('Market Prices')}
              </Link>
            </li>
            <li>
              <Link to="/demand-forecast" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow hover:scale-110 hover:from-pink-600 hover:to-purple-600 transition-transform duration-200">
                <span className="mr-1">📊</span> {t('Demand Forecast')}
              </Link>
            </li>
            <li>
              <button onClick={handleProfileClick} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white shadow hover:scale-110 hover:from-green-700 hover:to-blue-700 transition-transform duration-200">
                <UserCircle2 className="h-4 w-4 mr-1" /> {user ? (user.name ? user.name.split(' ')[0] : t('Profile')) : t('Profile')}
              </button>
            </li>
            <li>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="ml-2 px-2 py-1 rounded border text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </li>
          </>
        ) : location.pathname === '/market-price' || location.pathname === '/demand-forecast' ? (
          <>
            <li>
              <button onClick={handleProfileClick} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white shadow hover:scale-110 hover:from-green-700 hover:to-blue-700 transition-transform duration-200">
                <UserCircle2 className="h-4 w-4 mr-1" /> {user ? (user.name ? user.name.split(' ')[0] : t('Profile')) : t('Profile')}
              </button>
            </li>
            <li>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="ml-2 px-2 py-1 rounded border text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </li>
          </>
        ) : location.pathname === '/cart' ? (
          <>
            <li>
              <button onClick={handleProfileClick} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white shadow hover:scale-110 hover:from-green-700 hover:to-blue-700 transition-transform duration-200">
                <UserCircle2 className="h-4 w-4 mr-1" /> {user ? (user.name ? user.name.split(' ')[0] : t('Profile')) : t('Profile')}
              </button>
            </li>
            <li>
              <Link to="/bulk-order" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow hover:scale-110 hover:from-purple-500 hover:to-indigo-500 transition-transform duration-200">
                <PackageSearch className="h-4 w-4 mr-1" /> {t('Bulk Order')}
              </Link>
            </li>
            <li>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="ml-2 px-2 py-1 rounded border text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </li>
          </>
        ) : location.pathname === '/bulk-order' ? (
          <>
            <li>
              <Link to="/cart" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-400 to-blue-400 text-white shadow hover:scale-110 hover:from-green-500 hover:to-blue-500 transition-transform duration-200 relative">
                <ShoppingCart className="h-4 w-4 mr-1" /> {t('Cart')}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <button onClick={handleProfileClick} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white shadow hover:scale-110 hover:from-green-700 hover:to-blue-700 transition-transform duration-200">
                <UserCircle2 className="h-4 w-4 mr-1" /> {user ? (user.name ? user.name.split(' ')[0] : t('Profile')) : t('Profile')}
              </button>
            </li>
            <li>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="ml-2 px-2 py-1 rounded border text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </li>
          </>
        ) : location.pathname === '/track-order' ? (
          <>
            <li>
              <button onClick={handleProfileClick} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white shadow hover:scale-110 hover:from-green-700 hover:to-blue-700 transition-transform duration-200">
                <UserCircle2 className="h-4 w-4 mr-1" /> {user ? (user.name ? user.name.split(' ')[0] : t('Profile')) : t('Profile')}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/cart" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-400 to-blue-400 text-white shadow hover:scale-110 hover:from-green-500 hover:to-blue-500 transition-transform duration-200 relative">
                <ShoppingCart className="h-4 w-4 mr-1" /> {t('Cart')}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-yellow-400 to-pink-400 text-white shadow hover:scale-110 hover:from-yellow-500 hover:to-pink-500 transition-transform duration-200">
                <Truck className="h-4 w-4 mr-1" /> {t('Track Order')}
              </Link>
            </li>
            <li>
              <Link to="/bulk-order" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow hover:scale-110 hover:from-purple-500 hover:to-indigo-500 transition-transform duration-200">
                <PackageSearch className="h-4 w-4 mr-1" /> {t('Bulk Order')}
              </Link>
            </li>
            <li>
              <Link to="/market-price" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-500 to-blue-500 text-white shadow hover:scale-110 hover:from-green-600 hover:to-blue-600 transition-transform duration-200">
                <span className="mr-1">📈</span> {t('Market Prices')}
              </Link>
            </li>
            <li>
              <Link to="/demand-forecast" className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow hover:scale-110 hover:from-pink-600 hover:to-purple-600 transition-transform duration-200">
                <span className="mr-1">📊</span> {t('Demand Forecast')}
              </Link>
            </li>
            <li>
              <button onClick={handleProfileClick} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-green-600 to-blue-600 text-white shadow hover:scale-110 hover:from-green-700 hover:to-blue-700 transition-transform duration-200">
                <UserCircle2 className="h-4 w-4 mr-1" /> {user ? (user.name ? user.name.split(' ')[0] : t('Profile')) : t('Profile')}
              </button>
            </li>
            {/* Login Button - show only if not logged in */}
            {!user && (
              <li>
                <button onClick={() => navigate('/login')} className="flex items-center px-2 py-1 rounded bg-gradient-to-r from-blue-600 to-green-600 text-white shadow hover:scale-110 hover:from-blue-700 hover:to-green-700 transition-transform duration-200">
                  {t('Login')}
                </button>
              </li>
            )}
            {/* Language Switcher */}
            <li>
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="ml-2 px-2 py-1 rounded border text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ்</option>
              </select>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
