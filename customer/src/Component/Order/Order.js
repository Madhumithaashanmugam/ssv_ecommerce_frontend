// src/pages/OrderSuccessPage.js
import React from 'react';
import './Order.css';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-container">
      <FaCheckCircle className="success-icon" />
      <h1>Your Order Has Been Placed Successfully!</h1>
      <p className="sub-text">Thank you for shopping with us. You will receive a confirmation shortly.</p>
      <button className="home-button" onClick={() => navigate('/')}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default OrderSuccessPage;
