// ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendResetOtp = async (email) => {
    await axios.post('http://127.0.0.1:8000/api/vendor/users/request-reset-otp', { email });
  };

  const handleSendOtp = async () => {
    if (!email) return;

    setLoading(true);
    try {
      await sendResetOtp(email);
      navigate('/verify-otp-forgot', { state: { email } });
    } catch {}
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSendOtp} disabled={loading || !email}>
          {loading ? 'Please wait...' : 'Send OTP'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
