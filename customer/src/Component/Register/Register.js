import React, { useState } from 'react';
import { sendOtp } from './Service';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import AuthLayout from '../../HomePage/AuthLayout';

function Register() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 🔁 Prevent double click
  const [errorMessage, setErrorMessage] = useState(''); // 🔴 For UI error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (email.trim() !== '') {
      setLoading(true);
      try {
        await sendOtp({ email }); // ✅ Send as JSON body
        navigate('/register/verify-otp', { state: { email } }); // ✅ Pass email forward
      } catch (error) {
        console.error('Send OTP failed:', error); // For debugging

        // ✅ Show error in UI
        if (error.response && error.response.data && error.response.data.detail) {
          setErrorMessage(error.response.data.detail);
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Failed to send OTP. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Please enter your email.');
    }
  };

  return (
    <AuthLayout>
      <div className="register-container">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            required
          />
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        {/* ✅ Show error message if present */}
        {errorMessage && <div className="register-error">{errorMessage}</div>}
      </div>
    </AuthLayout>
  );
}

export default Register;
