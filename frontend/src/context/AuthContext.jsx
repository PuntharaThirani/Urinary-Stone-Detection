import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Context එක නිර්මාණය කිරීම
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User Object (name, role, etc.)
  const [loading, setLoading] = useState(true); // App එක load වෙනකම්

  // 1. App එක පටන් ගන්නකොට කලින් Login වෙලාද බලනවා
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      
      if (token && role) {
        // සරලව user state එක update කරනවා
        setUser({ role: role, token: token });
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser({ name: data.name, role: data.role, token: data.token });
    return data; // Component එකට data යවනවා redirect කරන්න
  };

  // 3. Register Function
  const register = async (userData) => {
    return await authService.register(userData);
  };

  // 4. Logout Function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};