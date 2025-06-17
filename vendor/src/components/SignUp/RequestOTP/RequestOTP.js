import React, { useState } from 'react';
import axios from 'axios';
import './RequestOTP.css';
import { useNavigate } from 'react-router-dom';

const RequestOtpPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/vendor/users/request-otp?email=${encodeURIComponent(email)}`
      );

      const message = res.data?.message;

      if (message === 'User already exists and is verified.') {
        setInfoMessage(message);
        // Optionally redirect directly to login instead of verify-otp
        // navigate('/vendor-signin');
      } else {
        navigate('/verify-otp', { state: { email } });
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-otp-container">
      <h2>Vendor Login - Request OTP</h2>
      <input
        type="email"
        placeholder="Enter Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="request-otp-input"
        disabled={loading}
      />
      <button
        onClick={handleRequestOtp}
        className="request-otp-button"
        disabled={loading || !email}
      >
        {loading ? 'Please wait...' : 'Request OTP'}
      </button>

      {infoMessage && <p className="info-message">{infoMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RequestOtpPage;
