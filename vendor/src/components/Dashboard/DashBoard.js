import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import api from '../SignIn/api';


const Dashboard = () => {
  const navigate = useNavigate();

  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    declined: 0,
    returned: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [onlineRes, offlineRes] = await Promise.all([
          api.get('http://localhost:8000/orders/'),
          api.get('http://localhost:8000/offline-order/orders/returned'),
        ]);

        const onlineOrders = Array.isArray(onlineRes.data)
          ? onlineRes.data
          : onlineRes.data.orders || [];

        const offlineOrders = offlineRes.data?.returned_orders || [];

        const statusCount = {
          pending: onlineOrders.filter(order => order.order_status === 'Pending').length,
          accepted: onlineOrders.filter(order => order.order_status === 'Accepted').length,
          completed: onlineOrders.filter(order => order.order_status === 'Completed').length,
          declined: onlineOrders.filter(order => order.order_status === 'Declined').length,
          returned: onlineOrders.filter(order => order.order_status === 'Returned').length + offlineOrders.length,
        };

        setOrderCounts(statusCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const goToAddCategory = () => navigate('/add-category');
  const handleLogout = () => navigate("/vendor/details");

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-top">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <button className="add-button" onClick={goToAddCategory}>Add Category</button>
            <FaUserCircle className="profile-icon" onClick={handleLogout} title="Logout" />
          </div>
        </div>
        <p>Welcome back, Vendor! Here's your quick overview.</p>
      </header>

      <div className="dashboard-cards">
        <div className="card" onClick={() => navigate('/orders/pending')}>
          <h2>Pending Orders</h2>
          <p>{orderCounts.pending}</p>
        </div>

        <div className="card" onClick={() => navigate('/orders/accepted')}>
          <h2>Accepted Orders</h2>
          <p>{orderCounts.accepted}</p>
        </div>

        <div className="card" onClick={() => navigate('/orders/completed')}>
          <h2>Completed Orders</h2>
          <p>{orderCounts.completed}</p>
        </div>

        <div className="card" onClick={() => navigate('/orders/declined')}>
          <h2>Declined Orders</h2>
          <p>{orderCounts.declined}</p>
        </div>

        <div className="card" onClick={() => navigate('/all-items')}>
          <h2>View All</h2>
          <p>Items</p>
        </div>

        <button className="add-button" onClick={() => navigate('/analytics')}>
          Analytics
        </button>

        <div className="card" onClick={() => navigate('/orders/place-order')}>
          <h2>Place Order</h2>
          <p>Offline</p>
        </div>

        <div className="card" onClick={() => navigate('/orders/list')}>
          <h2>Offline Orders</h2>
          <p></p>
        </div>

        <div className="card" onClick={() => navigate('orders/returned')}>
          <h2>Returned Orders</h2>
          <p>{orderCounts.returned}</p>
          <small style={{ fontSize: '0.75rem', color: '#666' }}>(Online + Offline)</small>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
