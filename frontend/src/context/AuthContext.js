import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { 
  setAuthToken, 
  getStoredToken, 
  getStoredUserData, 
  clearAuthData,
  verifyToken
} from "../utils/authUtils";

// ✅ Create the Auth context
const AuthContext = createContext(null);

// ✅ AuthProvider component to wrap your entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Setup axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      // Remove the interceptor when the component unmounts
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // Load user data from localStorage and verify token on initial load
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        setLoading(true);
        const storedToken = getStoredToken();
        const storedUser = getStoredUserData();
        
        if (storedToken && storedUser) {
          // Set initial state from localStorage
          setToken(storedToken);
          setUser(storedUser);
          
          // Verify token with backend
          try {
            const response = await verifyToken();
            if (response.valid) {
              // Update user data from server response
              setUser(response.user);
              console.log("Token verified successfully, user data updated");
            } else {
              throw new Error("Invalid token response");
            }
          } catch (verifyError) {
            console.error("Token verification failed:", verifyError);
            // If token verification fails, clear auth data
            clearAuthData();
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        clearAuthData();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = (userData, authToken) => {
    try {
      // Ensure we have a token
      if (!authToken) {
        console.error("No token provided during login");
        return false;
      }

      // Store in state
      setUser(userData);
      setToken(authToken);
      
      // Use utility functions to store data and set token
      setAuthToken(authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      console.log("User logged in successfully:", userData.name);
      
      // Return true to indicate successful login
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const logout = () => {
    try {
      // Clear state
      setUser(null);
      setToken(null);
      
      // Use utility function to clear auth data
      clearAuthData();
      
      console.log("User logged out successfully");
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      loading,
      token
    }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ✅ Default export if needed elsewhere
export default AuthContext;