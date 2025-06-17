import React, { useState } from 'react';
import { verifyOtp } from './VerifyOtpService';
import './VerifyOtp.css';
import AuthLayout from '../../HomePage/AuthLayout';
import { useNavigate, useLocation } from 'react-router-dom';

function RegisterVerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';  // ✅ use email now

  const [otp, setOtp] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (email && otp.trim()) {
      try {
        const response = await verifyOtp({ email, otp });  // ✅ send email to backend
        navigate('/sign-up', { state: { email } });         // ✅ pass email to next page
      } catch (error) {
        alert('Failed to verify OTP. Try again.');
      }
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <AuthLayout>
      <div className="verify-container">
        <h2 className="verify-title">Verify OTP</h2>
        <form onSubmit={handleVerify} className="verify-form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="verify-input"
          />
          <button type="submit" className="verify-button">
            Verify OTP
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default RegisterVerifyOTP;
