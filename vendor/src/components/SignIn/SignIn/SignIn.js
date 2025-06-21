import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../Assets/SSV_logo.png';
import './SignIn.css';

const VendorSigninPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    return password.length >= 8 && password.length <= 12;
  };

  const handleSignin = async () => {
    if (!username || !isPasswordValid(password)) return;

    setLoading(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:8000/api/vendor/auth/vendor/auth/login-step1',
        new URLSearchParams({ username, password }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      navigate('/otp-verification', { state: { email: username } });
    } catch {
      setError('Login failed. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-container">
        <div className="signin-header">
          <img src={logo} alt="SSV Logo" className="signin-logo" />
          <h1 className="signin-title">Sri Sai Venkateshwara Traders</h1>
        </div>

        <h2 className="signin-subtitle">Vendor Sign In</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signin-input"
          disabled={loading}
        />

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signin-input"
          disabled={loading}
        />

        <div style={{ textAlign: 'right', marginTop: '5px' }}>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              fontSize: '12px',
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: isPasswordValid(password) ? 'green' : 'red' }}>
          Password must be 8 to 12 characters long.
        </p>


        <div className="signin-links">
          <Link to="/forgot-password" className="signin-link">
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleSignin}
          className="signin-button"
          disabled={loading || !username || !isPasswordValid(password)}
        >
          {loading ? 'Please wait...' : 'Send OTP'}
        </button>

        <div className="signin-links">
          <span>Don't have an account? </span>
          <Link to="/vendor/request-otp" className="signin-link">
            Sign Up
          </Link>
        </div>

        {error && <p className="signin-error">{error}</p>}
      </div>
    </div>
  );
};

export default VendorSigninPage;
