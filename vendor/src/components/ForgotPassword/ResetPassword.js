// ResetPassword.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return pattern.test(password);
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid(newPassword)) return;

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/vendor/users/reset-password', {
        email,
        otp,
        new_password: newPassword,
      });
      navigate('/vendor-signin');
    } catch {}
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <p>Email: <strong>{email}</strong></p>

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />

        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              fontSize: '12px',
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: isPasswordValid(newPassword) ? 'green' : 'red' }}>
          Must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number.
        </p>

        <button
          onClick={handleResetPassword}
          disabled={loading || !isPasswordValid(newPassword)}
        >
          {loading ? 'Please wait...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
