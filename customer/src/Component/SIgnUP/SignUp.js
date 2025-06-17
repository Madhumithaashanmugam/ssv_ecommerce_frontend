import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from './Service';
import AuthLayout from '../../HomePage/AuthLayout';
import './SignUp.css';

function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    hashed_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'hashed_password') {
      const pattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      setIsValidPassword(pattern.test(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone_number || !formData.hashed_password || !email || !isValidPassword) return;

    const dataToSend = {
      ...formData,
      email,
    };

    try {
      await registerUser(dataToSend);
      navigate('/');
    } catch (error) {
      // handle silently
    }
  };

  return (
    <AuthLayout>
      <div className="signup-container">
        <h2 className="signup-title">Complete Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="hashed_password"
            placeholder="Password"
            value={formData.hashed_password}
            onChange={handleChange}
            className="signup-input"
          />
          <p
            style={{
              fontSize: "14px",
              color: "#000",
              cursor: "pointer",
              marginBottom: "10px",
              marginTop: "-8px"
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </p>
          {!isValidPassword && (
            <p style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}>
              Password must be at least 8 characters, include 1 capital letter and 1 number.
            </p>
          )}
          <button type="submit" className="signup-button" disabled={!isValidPassword}>
            Register
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
