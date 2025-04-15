
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerLogin } from './Service';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await customerLogin(email, password);
      console.log(' Login success:', result);

      localStorage.setItem('token', result.access_token);
      alert('🎉 Logged in successfully!');
      navigate('/profile');
    } catch (error) {
      console.error(' Login failed:', error);
      alert('Login failed: ' + (error.response?.data?.detail || 'Something went wrong.'));
    }
    navigate('/')
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleLogin} className="signin-form">
        <h2 className="signin-heading">Customer Sign In</h2>

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
      </form>
    </div>
  );
};

export default SignIn;


