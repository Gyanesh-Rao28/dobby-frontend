// src/services/auth.service.js
import api from "./api";

export const AuthService = {
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);

    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
