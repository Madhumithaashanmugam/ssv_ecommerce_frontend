// Dashboard.js
import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/signin');
  };

  const goToAddCategory = () => {
    navigate('/add-category');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-top">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="add-button" onClick={goToAddCategory}>Add Category</button>
            <FaUserCircle className="profile-icon" onClick={goToProfile} />
          </div>
        </div>
        <p>Welcome back! Here's your quick overview.</p>
      </header>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Orders</h2>
          <p>128</p>
        </div>
        <div className="card">
          <h2>Revenue</h2>
          <p>$4,530</p>
        </div>
        <div className="card">
          <h2>Customers</h2>
          <p>87</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
