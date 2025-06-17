import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css'; // Optional: create your own styles

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success-container">
      <div className="order-success-box">
        <div className="checkmark">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p></p>
        <button onClick={() => navigate('/orders/list')}>View Orders</button>
      </div>
    </div>
  );
};

export default OrderSuccess;

