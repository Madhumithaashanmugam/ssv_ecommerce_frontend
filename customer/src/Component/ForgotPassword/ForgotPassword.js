// components/ForgotPassword/ForgotPassword.js

import React, { useState } from 'react';
import './ForgotPassword.css';
import { sendResetOtp } from './service';
import AuthLayout from '../../HomePage/AuthLayout';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false); // ⛳ State to disable button
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true); // Disable the button
    try {
      await sendResetOtp(email);
      
      navigate('/verify-otp', { state: { email } }); // ✅ Pass email to next page
    } catch (error) {
      setIsSending(false); // Re-enable on error
    }
  };

  return (
    <AuthLayout>
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSend}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isSending}>
            {isSending ? 'Please wait...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
