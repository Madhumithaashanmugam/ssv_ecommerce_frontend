import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext'; // adjust path if needed
import './VerifyOTP.css';
import logo from '../../Assets/SSV_logo.png';

const VendorOtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || '';

  const handleVerifyOtp = async () => {
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/vendor/auth/vendor/auth/login-step2',
        null,
        {
          params: { email, otp },
        }
      );

      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      login(access_token, user);

      navigate('/');
    } catch {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="signin-header">
        <img src={logo} alt="SSV Logo" className="signin-logo" />
        <h1 className="signin-title">Sri Sai Venkateshwara Traders</h1>
      </div>

      <h2>Verify OTP</h2>
      <p>The OTP will be sent to the vendor. Please contact the vendor to get the OTP.</p>
      <p>Your email: <strong>{email}</strong></p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="otp-input"
        disabled={loading}
      />
      <button
        onClick={handleVerifyOtp}
        className="otp-button"
        disabled={loading || !otp}
      >
        {loading ? 'Please wait...' : 'Verify OTP'}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default VendorOtpVerification;
