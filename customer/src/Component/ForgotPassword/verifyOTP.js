// components/ForgotPassword/VerifyOTP.js

import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import AuthLayout from '../../HomePage/AuthLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetOtp } from './service';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const passedEmail = location.state?.email;
    if (passedEmail) {
      setEmail(passedEmail);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await verifyResetOtp(email, otp); // send { email, otp }
      navigate('/reset-password', {
        state: {
          email: email,
          otp: otp
        }
      });
    } catch (err) {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <div className="forgot-password-container">
        <h2>Verify OTP</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={isVerifying}>
            {isVerifying ? 'Please wait...' : 'Verify'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
