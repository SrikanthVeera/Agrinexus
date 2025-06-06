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
        const res = await axios.get(`/api/reviews/${userId}`);
        setReviews(res.data);
        setErrorMsg(''); // Clear any previous errors
      } catch (error) {
        handleApiError(error);
        setReviews([]);
      }
    };

    fetchReviews();
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
      
      await axios.post('/api/reviews', {
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating: newRating,
        comment: newComment,
      });
      
      // Refresh reviews
      const userId = user._id || user.id;
      const res = await axios.get(`/api/reviews/${userId}`);
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
    <div className="container mx-auto px-4 py-8">
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMsg}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={t("Avatar")}
            className="h-24 w-24 rounded-full border-4 border-green-600 mb-3"
          />
          <h2 className="text-2xl font-bold text-green-700">{user.name}</h2>
          <p className="text-sm text-gray-500 italic capitalize">{t(user.role)}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-green-700 mb-2">{t('Reviews')}</h3>
          {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          <ul className="space-y-2">
            {reviews.map((r, idx) => (
              <li key={idx} className="bg-gray-100 rounded p-2">
                <span className="font-semibold text-yellow-600">{'★'.repeat(r.rating)}</span>
                <span className="ml-2 text-gray-700">{r.comment}</span>
                <div className="text-xs text-gray-500">By User #{r.reviewer_id} on {new Date(r.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Review Form (if not reviewing self) */}
        {currentUser && (currentUser._id || currentUser.id) !== (user._id || user.id) && (
          <form onSubmit={handleReviewSubmit} className="mb-6 bg-green-50 p-4 rounded">
            <h4 className="font-bold mb-2">{t('Add a Review')}</h4>
            <label className="block mb-2">
              {t('Rating:')}
              <select value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="ml-2">
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
            <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {submitting ? t('Submitting...') : t('Submit Review')}
            </button>
          </form>
        )}

        {/* User Details */}
        <div className="space-y-3 text-gray-700 mb-6">
          <div>
            <strong>{t('Name:')}</strong> {user.name}
          </div>
          <div>
            <strong>{t('Role:')}</strong> <span className="capitalize">{t(user.role)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleEditProfile}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <FaEdit /> {t('Edit Profile')}
          </button>

          <button
            onClick={handleChangePassword}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            <FaKey /> {t('Change Password')}
          </button>

          <button
            onClick={handleMyOrders}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <FaShoppingBag /> {t('My Orders')}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <FaSignOutAlt /> {t('Logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
