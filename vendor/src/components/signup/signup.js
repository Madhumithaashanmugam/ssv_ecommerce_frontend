import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVendorUser } from './service'; 
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      phone_number: phone,
      hashed_password: password,
    };

    try {
      const result = await createVendorUser(userData);
      console.log(' User created:', result);

      //  Save token and user info in localStorage
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));

      alert('🎉 Signed up and logged in successfully!');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error(' Error creating user:', error);
      alert('Error: ' + (error.response?.data?.detail || 'Something went wrong.'));
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-heading">Vendor Sign Up</h2>

        <label className="signup-label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="signup-input"
          required
        />

        <label className="signup-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          required
        />

        <label className="signup-label">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="signup-input"
          required
        />

        <label className="signup-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          required
        />

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
