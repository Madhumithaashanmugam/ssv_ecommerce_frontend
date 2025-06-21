import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DeclinedOrders.css';
import { useNavigate } from 'react-router-dom';


const DeclinedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchUserInfo = async (userId, guestUserId) => {
    try {
      if (userId) {
        const res = await axios.get(`http://localhost:8000/api/customer/users/customer/users/${userId}`);
        return {
          name: res.data.name || 'Customer',
          phone_number: res.data.phone_number || 'Unknown',
        };
      } else if (guestUserId) {
        const res = await axios.get(`http://localhost:8000/guest-user/guest-user/id/${guestUserId}`);
        return {
          name: res.data.name || 'Guest',
          phone_number: res.data.phone_number || 'Unknown',
        };
      }
    } catch {
      return { name: 'Unknown', phone_number: 'Unknown' };
    }
  };

  useEffect(() => {
    const fetchDeclinedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/orders/status/Declined');
        const data = Array.isArray(response.data[0]) ? response.data[0] : response.data;

        const ordersWithUserInfo = await Promise.all(
          data.map(async (order) => {
            const userInfo = await fetchUserInfo(order.user_id, order.guest_user_id);
            return { ...order, ...userInfo };
          })
        );

        setOrders(ordersWithUserInfo);
        setFilteredOrders(ordersWithUserInfo);
      } catch (error) {
        console.error("Error fetching declined orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeclinedOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const value = searchTerm.toLowerCase();

      if (filterType === 'name') return order.name?.toLowerCase().includes(value);
      if (filterType === 'phone') return order.phone_number?.includes(value);
      if (filterType === 'reason') return (order.reason || '').toLowerCase().includes(value);

      if (filterType === 'dateRange') {
        if (!fromDate || !toDate) return true;
        const orderDate = new Date(order.created_datetime).toISOString().split('T')[0];
        return orderDate >= fromDate && orderDate <= toDate;
      }

      return true;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, filterType, fromDate, toDate, orders]);

  const groupByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const date = new Date(order.created_datetime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
      acc[date] = acc[date] || [];
      acc[date].push(order);
      return acc;
    }, {});
  };

  const groupedOrders = groupByDate(filteredOrders);

  if (loading) {
    return <div>Loading declined orders...</div>;
  }

  return (
    <div className="declined-orders-container">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
      <h2>Declined Orders</h2>

      <div className="search-bar">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="name">Search by Name</option>
          <option value="phone">Search by Phone</option>
          <option value="reason">Search by Decline Reason</option>
          <option value="dateRange">Search by Date Range</option>
        </select>

        {filterType === 'dateRange' ? (
          <div className="date-range-inputs">
            <label>
              From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </label>
            <label>
              To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </label>
          </div>
        ) : (
          <input
            type="text"
            placeholder={`Enter ${filterType}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      {Object.keys(groupedOrders).length === 0 ? (
        <p>No declined orders found.</p>
      ) : (
        Object.entries(groupedOrders).map(([date, orders]) => (
          <div key={date}>
            <h3>{date}</h3>
            <div className="order-grid">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Phone:</strong> {order.phone_number}</p>
                  <p><strong>Total Price:</strong> ₹{order.total_price}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}</p>
                  <p><strong>Status:</strong> {order.order_status}</p>
                  <p><strong>Payment:</strong> {order.payment_method} - {order.payment_status}</p>
                  <p><strong>Is Paid:</strong> {order.is_paid ? 'Yes' : 'No'}</p>
                  <p><strong>Created:</strong> {new Date(order.created_datetime).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                  <p><strong>Decline Reason:</strong> {order.reason || 'Not specified'}</p>

                  <div className="items-list">
                    <h4>Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="item-details">
                        <img
                          src={`http://localhost:8000/${item.product_image.replace(/\\/g, '/')}`}
                          alt={item.item_name}
                          className="product-image"
                        />
                        <div className="item-info">
                          <p><strong>{item.item_name}</strong></p>
                          <p>Qty: {item.quantity}</p>
                          <p>Price: ₹{item.unit_price}</p>
                          <p>Total: ₹{item.total_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeclinedOrders;

