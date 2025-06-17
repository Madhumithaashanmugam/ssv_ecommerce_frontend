// src/components/Context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { createGuestUser } from '../GuestUser/Service'; // You must implement this API call

export const AuthContext = createContext();

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') || '');
  const [userInfo, setUserInfo] = useState(() => safeParse(localStorage.getItem('user')));
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const user = safeParse(localStorage.getItem('user'));
  const guestUserId = localStorage.getItem('guest_user_id');


  if (token && user) {
    setAuthToken(token);
    setUserInfo(user);
  } else if (guestUserId && !user) {
    // Possibly fetch guest user details here or create minimal userInfo
    setUserInfo({ guest_user_id: guestUserId });
  }

  setAuthReady(true);
}, []);


  const setAuthData = (token, user) => {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token || '');
    setUserInfo(user || null);
  };

  const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('guest_user_id');
  localStorage.removeItem('guest_cart_id'); // <- Clear cart too
  setAuthToken('');
  setUserInfo(null);
};


  const createGuest = async () => {
    const guestData = {
      name: 'Guest User',
      phone_number: '',
      email: 'guest@example.com',
      street_line: '',
      plot_number: '',
      city: '',
      state: '',
      zip_code: '',
    };

    try {
      const guestUser = await createGuestUser(guestData);
      setAuthData(guestUser.token, guestUser);
      localStorage.setItem('guest_user_id', guestUser.id);
    } catch (error) {
      console.error('Failed to create guest user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userInfo, setAuthData, logout, createGuest, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};
