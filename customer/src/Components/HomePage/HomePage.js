// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const Home = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/signup');
  };

  return (
    <div className="home-container">
      <div className="profile-icon" onClick={goToProfile}>
        👤
      </div>
      <h1>👋 Welcome to the Home Page of Customer!</h1>
    </div>
  );
};

export default Home;
