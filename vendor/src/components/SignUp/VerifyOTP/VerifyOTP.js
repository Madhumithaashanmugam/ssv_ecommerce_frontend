import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerifyOtp = async () => {
    if (!otp || !email) {
      setError('Missing OTP or Email.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/vendor/users/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`
      );

      // Pass email to signup page
      navigate('/vendor-signup', { state: { email } });
    } catch (err) {
      console.error(err.response?.data);
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="request-otp-container">
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="request-otp-input"
      />
      <button onClick={handleVerifyOtp} className="request-otp-button">
        Verify OTP
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default VerifyOtpPage;

