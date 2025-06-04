import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Create the Auth context
const AuthContext = createContext(null);

// ✅ AuthProvider component to wrap your entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user"); // Remove invalid data if it exists
    }
  }, []);

  const login = (userData, token = null) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      if (token) {
        localStorage.setItem("token", token);
      }
      setUser(userData);
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
      // Optionally, alert the user about the issue
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Error clearing auth data:", error);
      // Optionally, alert the user about the issue
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
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
