import React, { useState } from 'react';
import { sendOtp } from './Service';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import AuthLayout from '../../HomePage/AuthLayout';

function Register() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 🔁 Prevent double click
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setLoading(true);
      try {
        await sendOtp({ email }); // ✅ Send as JSON body
        navigate('/register/verify-otp', { state: { email } }); // ✅ Pass email forward
      } catch (error) {
        // Error handling silently
      } finally {
        setLoading(false); // 🔄 Re-enable button
      }
    } else {
      // No alert or log for empty email
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
      </div>
    </AuthLayout>
  );
}

export default Register;
