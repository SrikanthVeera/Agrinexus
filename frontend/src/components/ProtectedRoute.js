import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, token } = useAuth();
  const navigate = useNavigate();

  // Effect to check token on route change
  useEffect(() => {
    // If we have a token but no user, something is wrong
    // This can happen if the token is invalid or expired
    if (token && !user && !loading) {
      console.error("Token exists but no user data found");
      navigate("/login");
    }
  }, [token, user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // If roles are specified and user's role is not in the allowed roles, redirect to appropriate page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    switch (user.role) {
            case 'Buyer':
        return <Navigate to="/buyer/dashboard" />;
      case 'Seller':
        return <Navigate to="/farmer/dashboard" />;
      case 'DeliveryPartner':
        return <Navigate to="/delivery-partner" />;
      case 'Entrepreneur':
        return <Navigate to="/entrepreneur-details" />;
      default:
        return <Navigate to="/" />;
    }
  }

  // If authenticated and authorized, render the children
  return children;
};

export default ProtectedRoute;