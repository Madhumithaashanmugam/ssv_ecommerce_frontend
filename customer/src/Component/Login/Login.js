import React, { useState, useContext } from 'react';
import { loginCustomer } from './Service';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    const pattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return pattern.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      alert("Password must be at least 8 characters, contain 1 capital letter and 1 number.");
      return;
    }

    try {
      const data = await loginCustomer(email, password);
      setAuthData(data.access_token, data.user);
      navigate('/');
    } catch (err) {
      alert('Invalid credentials!');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Toggle visibility below input */}
        <p
          style={{
            fontSize: "14px",
            color: "#000",
            cursor: "pointer",
            marginBottom: "15px",
            marginTop: "-10px"
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </p>

        <button type="submit">Login</button>
      </form>

      <div className="login-links">
        <button onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
        <button onClick={() => navigate('/signup-register')}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignIn;
