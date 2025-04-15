import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorLogin } from './service';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await vendorLogin(email, password);
      console.log('✅ Login successful:', result);

      // Save token and user info in localStorage
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));

      alert('🎉 Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(' Login failed: ' + (error.response?.data?.detail || 'Please check your credentials.'));
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleLogin} className="signin-form">
        <h2 className="signin-heading">Vendor Sign In</h2>

        <label className="signin-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signin-input"
          required
        />

        <label className="signin-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signin-input"
          required
        />

        <button type="submit" className="signin-button">Sign In</button>

        <p className="signup-link">
          Don't have an account? <span onClick={goToSignUp}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
