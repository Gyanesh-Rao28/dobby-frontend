// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";

const AuthContext = createContext(null);

// Export the useAuth hook directly from the context file
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await AuthService.login(credentials);
      setCurrentUser(data.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to login",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await AuthService.register(userData);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to register",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate("/login");
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
