import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import AuthLayout from '../../HomePage/AuthLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from './service';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const passedEmail = location.state?.email;
    const passedOtp = location.state?.otp;

    if (passedEmail && passedOtp) {
      setEmail(passedEmail);
      setOtp(passedOtp);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,12}$/;
    return regex.test(password);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== retypePassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      alert("Password does not meet requirements.");
      return;
    }

    try {
      await resetPassword({ email, otp, new_password: newPassword });
      navigate('/signin');
    } catch (err) {}
  };

  return (
    <AuthLayout>
      <div className="forgot-password-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="toggle-text"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Retype New Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
            />
            <span
              className="toggle-text"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <p
            className="validation-msg"
            style={{
              color: isPasswordValid(newPassword) ? 'green' : 'red'
            }}
          >
            Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 8–12 characters long.
          </p>

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
