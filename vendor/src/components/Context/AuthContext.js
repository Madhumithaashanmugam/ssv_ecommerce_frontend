// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const token = localStorage.getItem('vendor_jwt');
    const user = localStorage.getItem('vendor_user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  const login = (token, user) => {
    localStorage.setItem('vendor_jwt', token);
    localStorage.setItem('vendor_user', JSON.stringify(user));
    setAuthData({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('vendor_jwt');
    localStorage.removeItem('vendor_user');
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
