// src/pages/PastOrders.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './PastOrders.css';

const PastOrders = () => {
  const { userInfo, authReady } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        if (!authReady || !userInfo) return;

        const payload = {
          user_id: userInfo.user_id || userInfo.id || null,
          guest_user_id: userInfo.guest_user_id || null,
        };


        const response = await axios.post('http://localhost:8000/by-user-or-guest', payload);
        setOrders(response.data || []);
      } catch (err) {
        console.error('❌ Failed to fetch orders:', err);
        setError('Failed to load past orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPastOrders();
  }, [authReady, userInfo]);

  if (!authReady) return <p>⏳ Initializing auth...</p>;
  if (loading) return <p>🔄 Loading past orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p>📭 No past orders found.</p>;

  return (
    <div className="past-orders-container">
      <h2>🧾 Past Orders</h2>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <p><strong>Order Status:</strong> {order.order_status}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
            <p><strong>Total Price:</strong> ₹{order.total_price.toLocaleString()}</p>
 <p><strong>Created:</strong> {new Date(order.created_datetime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: 'numeric', month: 'long', day: 'numeric' })}</p>
<p><strong>Updated:</strong> {new Date(order.updated_datetime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}</p>

            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item) => (
                <li key={item.item_id} className="order-item">
                  <div className="item-details">
                    <img
                      src={`http://localhost:8000/${item.product_image.replace(/\\/g, '/')}`}
                      alt={item.item_name}
                      className="product-image"
                    />
                    <div>
                      <p><strong>{item.item_name}</strong></p>
                      <p>Qty: {item.quantity}</p>
                      <p>Unit Price: ₹{item.unit_price}</p>
                      <p>Total: ₹{item.total_price}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastOrders;
