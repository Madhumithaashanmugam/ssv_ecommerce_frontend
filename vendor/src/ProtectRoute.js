// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './components/Context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authData } = useAuth();

  if (!authData) {
    return <Navigate to="/vendor-signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
