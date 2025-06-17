import React, { useEffect, useState } from 'react';
import '../DeclinedOrders/DeclinedOrders.css';
import api from '../SignIn/api';

const ReturnedOrders = () => {
  const [onlineOrders, setOnlineOrders] = useState([]);
  const [offlineOrders, setOfflineOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [orderType, setOrderType] = useState('all'); // new filter
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async (userId, guestUserId) => {
    try {
      if (userId) {
        const res = await api.get(`api/customer/users/customer/users/${userId}`);
        return {
          name: res.data.name || 'Customer',
          phone_number: res.data.phone_number || 'Unknown',
        };
      } else if (guestUserId) {
        const res = await api.get(`guest-user/guest-user/id/${guestUserId}`);
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
    const fetchOrders = async () => {
      try {
        const [onlineRes, offlineRes] = await Promise.all([
          api.get('orders/status/Returned'),
          api.get('offline-order/orders/returned'),
        ]);

        const onlineData = Array.isArray(onlineRes.data[0]) ? onlineRes.data[0] : onlineRes.data;
        const onlineWithUserInfo = await Promise.all(
          (Array.isArray(onlineData) ? onlineData : []).map(async (order) => {
            const userInfo = await fetchUserInfo(order.user_id, order.guest_user_id);
            return { ...order, ...userInfo };
          })
        );

        const offlineData = offlineRes.data?.returned_orders || [];
        setOnlineOrders(onlineWithUserInfo || []);
        setOfflineOrders(Array.isArray(offlineData) ? offlineData : []);
      } catch (error) {
        console.error('Error fetching returned orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filterOrders = (orders, isOffline = false) => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => {
      const value = searchTerm.toLowerCase();
      if (filterType === 'name') {
        const name = isOffline ? order.customer_name : order.name;
        return name?.toLowerCase().includes(value);
      }
      if (filterType === 'phone') {
        const phone = isOffline ? order.customer_phone : order.phone_number;
        return phone?.includes(value);
      }
      if (filterType === 'date') {
        const date = new Date(order.created_datetime || order.order_date).toLocaleDateString();
        return date.includes(value);
      }
      return true;
    });
  };

  const groupByDate = (orders, dateField) => {
    return (orders || []).reduce((acc, order) => {
      const date = new Date(order[dateField]).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(order);
      return acc;
    }, {});
  };

  const filteredOnline = filterOrders(onlineOrders);
  const filteredOffline = filterOrders(offlineOrders, true);

  const groupedOnline = groupByDate(filteredOnline, 'created_datetime');
  const groupedOffline = groupByDate(filteredOffline, 'order_date');

  const allDates = [...new Set([
    ...(orderType !== 'offline' ? Object.keys(groupedOnline) : []),
    ...(orderType !== 'online' ? Object.keys(groupedOffline) : [])
  ])].sort((a, b) => new Date(b) - new Date(a));

  if (loading) return <div>Loading returned orders...</div>;

  return (
    <div className="declined-orders-container">
      <h2>Returned Orders</h2>

      <div className="search-bar">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="name">Search by Name</option>
          <option value="phone">Search by Phone</option>
          <option value="date">Search by Date</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={orderType} onChange={(e) => setOrderType(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option value="all">All Orders</option>
          <option value="online">Only Online Orders</option>
          <option value="offline">Only Offline Orders</option>
        </select>
      </div>

      {allDates.length === 0 ? (
        <p>No returned orders found.</p>
      ) : (
        allDates.map((date) => (
          <div key={date}>
            <h3>{date}</h3>

            {/* Online */}
            {orderType !== 'offline' && groupedOnline[date] && (
              <>
                <h4 style={{ color: 'blue' }}>Online Returned Orders</h4>
                <div className="order-grid">
                  {groupedOnline[date].map((order) => (
                    <div key={order.id} className="order-card">
                      <p><strong>Name:</strong> {order.name}</p>
                      <p><strong>Phone:</strong> {order.phone_number}</p>
                      <p><strong>Total Price:</strong> ₹{order.total_price}</p>
                      <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}</p>
                      <p><strong>Status:</strong> {order.order_status}</p>
                      <p><strong>Payment:</strong> {order.payment_method} - {order.payment_status}</p>
                      <p><strong>Is Paid:</strong> {order.is_paid ? 'Yes' : 'No'}</p>
                      <p><strong>Created:</strong> {new Date(order.created_datetime).toLocaleString()}</p>
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
              </>
            )}

            {/* Offline */}
            {orderType !== 'online' && groupedOffline[date] && (
              <>
                <h4 style={{ color: 'green' }}>Offline Returned Orders</h4>
                <div className="order-grid">
                  {groupedOffline[date].map((order) => (
                    <div key={order.id} className="order-card">
                      <p><strong>Name:</strong> {order.customer_name}</p>
                      <p><strong>Phone:</strong> {order.customer_phone}</p>
                      <p><strong>Total:</strong> ₹{order.total_amount}</p>
                      <p><strong>Discount:</strong> ₹{order.discount}</p>
                      <p><strong>Amount Paid:</strong> ₹{order.amount_paid}</p>
                      <p><strong>Balance Due:</strong> ₹{order.balance_due}</p>
                      <p><strong>Payment:</strong> {order.payment_method} - {order.payment_status}</p>
                      <p><strong>Delivery:</strong> {order.delivery_date}</p>
                      <p><strong>Notes:</strong> {order.notes}</p>
                      <p><strong>Created:</strong> {new Date(order.created_datetime).toLocaleString()}</p>

                      <div className="items-list">
                        <h4>Items:</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="item-details">
                            <div className="item-info">
                              <p><strong>{item.item_name}</strong></p>
                              <p>Qty: {item.quantity}</p>
                              <p>Price: ₹{item.item_price}</p>
                              <p>Final Price: ₹{item.final_price}</p>
                              <p>Total: ₹{item.line_total}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReturnedOrders;
