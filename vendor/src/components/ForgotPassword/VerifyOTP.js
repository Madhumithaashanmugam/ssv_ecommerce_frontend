// VerifyOtp.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    setLoading(true); // disable button

    try {
      // Here we assume backend will just verify OTP (optional pre-check)
      await axios.post('http://127.0.0.1:8000/api/vendor/users/verify-reset-otp', { email, otp });

      // If successful, navigate to reset password with email & otp
      navigate('/reset-password-forgot', { state: { email, otp } });
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Enter OTP</h2>
        <p>OTP sent to: <strong>{email}</strong></p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOtp} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
