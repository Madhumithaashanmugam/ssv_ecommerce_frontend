import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './SignUp.css';

const VendorSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const email = location.state?.email;

  const isValidPassword = (pwd) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleSignup = async () => {
    if (!name || !email || !phoneNumber || !password) {
      setError('All fields are required.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long, include one capital letter and one number.');
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone_number: phoneNumber,
        hashed_password: password,
      };

      const response = await axios.post('http://localhost:8000/api/vendor/users/register', payload);

      setSuccess('Registration successful. You can now log in.');
      setError('');
      navigate('/vendor-signin');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
      setSuccess('');
    }
  };

  return (
    <div className="vendor-signup-container">
      <h2>Vendor Signup</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="vendor-signup-input"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="vendor-signup-input"
      />

      <div className="password-field">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="vendor-signup-input"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password-btn"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <input
        type="text"
        value={email}
        readOnly
        className="vendor-signup-input email-readonly"
      />

      <button onClick={handleSignup} className="vendor-signup-button">
        Register
      </button>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default VendorSignupPage;
