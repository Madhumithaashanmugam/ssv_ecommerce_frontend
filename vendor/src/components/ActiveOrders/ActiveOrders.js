import React, { useEffect, useState, useRef } from 'react';
import './ActiveOrder.css';
import api from '../SignIn/api';

const ActiveOrders = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const userCache = useRef({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);


  const fetchUserInfo = async (userId, guestUserId) => {
    const cacheKey = userId || guestUserId;
    if (userCache.current[cacheKey]) return userCache.current[cacheKey];

    try {
      let data = { phone_number: 'Unknown', name: 'Unknown' };
      if (userId) {
        const res = await api.get(`http://localhost:8000/api/customer/users/customer/users/${userId}`);
        data = {
          phone_number: res.data.phone_number || 'Unknown',
          name: res.data.name || 'Customer',
        };
      } else if (guestUserId) {
        const res = await api.get(`http://localhost:8000/guest-user/guest-user/id/${guestUserId}`);
        data = {
          phone_number: res.data.phone_number || 'Unknown',
          name: res.data.name || 'Guest',
        };
      }
      userCache.current[cacheKey] = data;
      return data;
    } catch (err) {
      console.error('Error fetching user info:', err);
      return { phone_number: 'Unknown', name: 'Unknown' };
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const response = await api.get('http://localhost:8000/orders/status/Accepted');
      const orders = response.data;

      const ordersWithUserInfo = await Promise.all(
        orders.map(async (order) => {
          const userInfo = await fetchUserInfo(order.user_id, order.guest_user_id);
          return { ...order, ...userInfo };
        })
      );

      setActiveOrders(ordersWithUserInfo);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, );

const openConfirmModal = (orderId) => {
  setSelectedOrderId(orderId);
  setShowConfirmModal(true);
};

const confirmCompleteOrder = async () => {
  try {
    const response = await api.put(`http://localhost:8000/orders/${selectedOrderId}/status`, {
      order_status: 'Completed',
    });

    if (response.status === 200) {
      console.log('Order marked as Completed');
      fetchActiveOrders();
    }
     window.location.reload();
  } catch (error) {
    console.error('Error updating order status:', error);
  } finally {
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  }
};


  const filteredOrders = activeOrders.filter(order => {
    if (filterType === 'name') {
      return order.name.toLowerCase().includes(searchValue.toLowerCase());
    } else if (filterType === 'phone') {
      return order.phone_number.includes(searchValue);
    } else if (filterType === 'dateRange') {
      if (!fromDate || !toDate) return true;
      const orderDate = new Date(order.created_datetime).toISOString().split('T')[0];
      return orderDate >= fromDate && orderDate <= toDate;
    }
    return true;
  });

  const groupedOrders = filteredOrders.reduce((groups, order) => {
    const dateKey = order.created_datetime.split('T')[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(order);
    return groups;
  }, {});

  return (
    <div className="active-orders-container">
      <h1>Active Orders</h1>

      <div className="search-filters">
        <select value={filterType} onChange={e => {
          setFilterType(e.target.value);
          setSearchValue('');
          setFromDate('');
          setToDate('');
        }}>
          <option value="">Select Filter</option>
          <option value="name">Search by Name</option>
          <option value="phone">Search by Phone</option>
          <option value="dateRange">Search by Date Range</option>
        </select>

        {filterType === 'name' || filterType === 'phone' ? (
          <input
            type="text"
            placeholder={`Enter ${filterType === 'name' ? 'Name' : 'Phone'}`}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        ) : filterType === 'dateRange' ? (
          <div className="date-range">
            <label>
              From:{' '}
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </label>
            <label>
              To:{' '}
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </label>
          </div>
        ) : null}
      </div>

<>
  {Object.keys(groupedOrders).length === 0 ? (
    <p>No active orders found.</p>
  ) : (
    Object.entries(groupedOrders).map(([date, orders]) => (
      <div key={date}>
        <h2 className="order-date-heading">{date}</h2>
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Phone Number:</strong> {order.phone_number}</p>
              <p><strong>Total Price:</strong> ₹{order.total_price}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>City:</strong> {order.city}</p>
              <p><strong>State:</strong> {order.state}</p>
              <p><strong>Payment Method:</strong> {order.payment_method}</p>
              <p><strong>Payment Status:</strong> {order.payment_status}</p>
              <p><strong>Is Paid:</strong> {order.is_paid ? 'Yes' : 'No'}</p>
              <p><strong>Created Date:</strong> {new Date(order.created_datetime).toLocaleString()}</p>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={`http://localhost:8000/${item.product_image.replace(/\\/g, '/')}`}
                      alt={item.item_name}
                      className="item-image"
                    />
                    <div>
                      <p><strong>{item.item_name}</strong></p>
                      <p>Qty: {item.quantity}</p>
                      <p>Unit Price: ₹{item.unit_price}</p>
                      <p>Total: ₹{item.total_price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {order.order_status === 'Completed' ? (
                <button className="completed-button completed" disabled>
                  ✅ Completed
                </button>
              ) : (
                <button className="completed-button" onClick={() => openConfirmModal(order.id)}>
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    ))
  )}

  {/* ✅ Single Modal placed outside the map to avoid multiple popups */}
  {showConfirmModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to mark this order as <strong>Completed</strong>?</p>
        <div className="modal-actions">
          <button onClick={confirmCompleteOrder} className="confirm-button-css">Yes, Complete</button>
          <button onClick={() => setShowConfirmModal(false)} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  )}
</>

    </div>
  );
};

export default ActiveOrders;
