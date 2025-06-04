import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If roles are specified and user's role is not in the allowed roles, redirect to appropriate page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user's role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" />;
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