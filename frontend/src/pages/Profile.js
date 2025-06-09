import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaKey, FaSignOutAlt, FaShoppingBag } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.timeout = 5000; // 5 second timeout

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]); // For entrepreneur orders
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [errorMsg, setErrorMsg] = useState("");

  // Function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      setErrorMsg(t('Request timed out. Please try again.'));
    } else if (!error.response) {
      setErrorMsg(t('Cannot connect to the server. Please make sure the backend is running.'));
    } else if (error.response.data && error.response.data.message) {
      setErrorMsg(error.response.data.message); // Show backend error
    } else {
      setErrorMsg(t('An error occurred. Please try again later.'));
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      
      // Use _id if available, otherwise fall back to id
      const userId = user._id || user.id;
      
      if (!userId) {
        console.error('User ID not found in user object:', user);
        setErrorMsg(t('User ID not found. Please try logging in again.'));
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`/api/reviews/${userId}`, config);
        setReviews(res.data);
        setErrorMsg(''); // Clear any previous errors
      } catch (error) {
        handleApiError(error);
        setReviews([]);
      }
    };

    // Fetch entrepreneur orders if role is Entrepreneur
    const fetchEntrepreneurOrders = async () => {
      if (!user || user.role !== "Entrepreneur") return;
      const userId = user._id || user.id;
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`/api/orders/my-orders/${userId}`, config);
        setOrders(res.data);
      } catch (error) {
        setOrders([]);
      }
    };

    fetchReviews();
    fetchEntrepreneurOrders();
  }, [user, t]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const reviewerId = currentUser._id || currentUser.id;
      const revieweeId = user._id || user.id;
      
      if (!reviewerId || !revieweeId) {
        setErrorMsg(t('User ID not found. Please try logging in again.'));
        return;
      }
      
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post('/api/reviews', {
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating: newRating,
        comment: newComment,
      }, config);
      
      // Refresh reviews
      const userId = user._id || user.id;
      const res = await axios.get(`/api/reviews/${userId}`, config);
      setReviews(res.data);
      
      // Reset form
      setNewRating(5);
      setNewComment("");
      setErrorMsg('');
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      t("Are you sure you want to delete your account? This cannot be undone.")
    );

    if (confirmDelete) {
      try {
        // Check if user object has id or _id property
        const userId = user._id || user.id;
        
        if (!userId) {
          setErrorMsg(t("User ID not found. Please try logging in again."));
          return;
        }
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          setErrorMsg(t("Authentication token not found. Please log in again."));
          return;
        }
        
        const response = await axios.delete(`/api/user/delete-account/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          localStorage.clear();
          alert(t("Account deleted successfully!"));
          navigate("/register");
        }
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">{t('Loading profile...')}</p>
      </div>
    );
  }

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleMyOrders = () => {
    navigate("/my-orders");
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 animate-fadein">
      <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-2xl p-0 border-4 border-blue-200 animate-fadein-slow overflow-hidden">
        {errorMsg && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMsg}
          </div>
        )}
        {/* Avatar & Name */}
        <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 via-green-400 to-purple-400 py-8 animate-fadein">
          <div className="h-28 w-28 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-blue-200 animate-fadein-slow overflow-hidden">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={t("Avatar")}
              className="h-24 w-24 rounded-full object-cover animate-fadein"
            />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white drop-shadow-lg animate-fadein">{user.name}</h2>
          <p className="text-white text-sm font-medium animate-fadein-slow italic capitalize">{t(user.role)}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-6 px-8 animate-fadein-slow">
          <h3 className="text-xl font-bold text-green-700 mb-2">{t('Reviews')}</h3>
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          <ul className="space-y-2">
            {reviews.map((r, idx) => (
              <li key={idx} className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-3 shadow animate-fadein" style={{animationDelay: `${idx * 60}ms`}}>
                <span className="font-semibold text-yellow-600">{'★'.repeat(r.rating)}</span>
                <span className="ml-2 text-gray-700">{r.comment}</span>
                <div className="text-xs text-gray-500">By User #{r.reviewer_id} on {new Date(r.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Review Form (if not reviewing self) */}
        {currentUser && (currentUser._id || currentUser.id) !== (user._id || user.id) && (
          <form onSubmit={handleReviewSubmit} className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl shadow animate-fadein-slow">
            <h4 className="font-bold mb-2 text-green-700">{t('Add a Review')}</h4>
            <label className="block mb-2">
              {t('Rating:')}
              <select value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="ml-2 rounded border-green-300">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 border rounded mb-2"
              required
            />
            <button type="submit" disabled={submitting} className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-500 hover:to-green-500 font-bold transition-all duration-300">
              {submitting ? t('Submitting...') : t('Submit Review')}
            </button>
          </form>
        )}

        {/* User Details */}
        <div className="space-y-3 text-gray-700 mb-6 px-8 animate-fadein-slow">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-blue-700">{t('Name:')}</span>
            <span className="ml-1 text-gray-800">{user.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-green-700">{t('Role:')}</span>
            <span className="ml-1 capitalize text-gray-800">{t(user.role)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 px-8 pb-8 animate-fadein-slow">
          <button
            onClick={handleEditProfile}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 animate-fadein"
          >
            <FaEdit /> {t('Edit Profile')}
          </button>

          <button
            onClick={handleChangePassword}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-600 hover:to-yellow-400 text-white font-bold rounded-lg shadow-lg transition-all duration-300 animate-fadein"
          >
            <FaKey /> {t('Change Password')}
          </button>

          <button
            onClick={handleMyOrders}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-purple-500 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 animate-fadein"
          >
            <FaShoppingBag /> {t('My Orders')}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-red-500 to-purple-500 hover:from-purple-500 hover:to-red-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 animate-fadein"
          >
            <FaSignOutAlt /> {t('Logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
