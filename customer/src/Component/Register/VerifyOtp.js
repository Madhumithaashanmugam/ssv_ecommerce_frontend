import React, { useState } from 'react';
import { verifyOtp } from './VerifyOtpService';
import './VerifyOtp.css';
import AuthLayout from '../../HomePage/AuthLayout';
import { useNavigate, useLocation } from 'react-router-dom';

function RegisterVerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (email && otp.trim()) {
      try {
        const response = await verifyOtp({ email, otp });
        navigate('/sign-up', { state: { email } });
      } catch (error) {
        setError('Failed to verify OTP. Try again.');
      }
    } else {
      setError('Please fill all fields.');
    }
  };

  return (
    <AuthLayout>
      <div className="verify-container">
        <h2 className="verify-title">Verify OTP</h2>
        <p className="verify-email">OTP sent to: <strong>{email}</strong></p>

        <form onSubmit={handleVerify} className="verify-form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="verify-input"
          />

          {error && (
            <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>
              {error}
            </p>
          )}

          <button type="submit" className="verify-button">
            Verify OTP
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default RegisterVerifyOTP;
