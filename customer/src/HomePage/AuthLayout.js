import React from 'react';
import '../HomePage/HomePage.css'; // Reuse same styling
import logo from '../Assets/SSV_logo.png'

const AuthLayout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <div className="branding">
        <img src={logo} alt="SSV Logo" className="ssv-logo" />
        <h1 className="ssv-heading">Sri Sai Venkateshwara Traders</h1>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
