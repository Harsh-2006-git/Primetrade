import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await authService.getMe();
        setUser(res.data.data);
      } catch (err) {
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user, accessToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
