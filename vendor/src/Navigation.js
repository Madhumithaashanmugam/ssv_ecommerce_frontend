// src/Navigation.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './component/Dashboard/dashbord';
import Signin from './component/profile/singIn/signin';
import Signup from './component/profile/singUp/signup';
import Profile from './component/profile/profile/profile';
import ProtectedRoute from './component/profile/profile/protectedRoute';

function Navigation({ authData, setAuthData }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute token={authData.token}>
            <Dashboard userId={authData.userId} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute token={authData.token}>
            <Dashboard userId={authData.userId} />
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<Signin setAuthData={setAuthData} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute token={authData.token}>
            <Profile userId={authData.userId} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Navigation;
