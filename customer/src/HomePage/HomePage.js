// components/HomePage/HomePage.js
import React from 'react';
import './HomePage.css';
import SignIn from '../Component/Login/Login'; // Correct path to SignIn
import logo from '../Assets/SSV_logo.png';

const HomePage = () => {
  return (
    <div className="page-wrapper">
      <div className="branding">
        <img src={logo} alt="SSV Logo" className="ssv-logo" />
        <h1 className="ssv-heading">Sri Sai Venkateshwara Traders</h1>
      </div>
      <SignIn />
    </div>
  );
};

export default HomePage;
