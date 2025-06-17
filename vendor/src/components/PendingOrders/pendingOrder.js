import React, { useEffect, useState, useRef } from 'react';
import api from '../SignIn/api';
import './PendingOrder.css';

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const prevOrderIds = useRef(new Set());
  const userCache = useRef({});
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedAcceptOrderId, setSelectedAcceptOrderId] = useState(null);




const fetchItemDetails = async (itemId) => {
  try {
    const response = await api.get(`http://localhost:8000/items/${itemId}`);
    console.log("Item details:", response.data);
    
    if (response.data) {
      setSelectedItemDetails(response.data);
      setShowItemModal(true);
    }
  } catch (error) {
    console.error('Error fetching item details:', error);
  }
};


  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(err => console.error("Audio play failed:", err));
    if (Notification.permission === 'granted') {
      new Notification('New Order Received!');
    }
  };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const fetchUserInfo = async (userId, guestUserId) => {
    const cacheKey = userId || guestUserId;
    if (userCache.current[cacheKey]) {
      return userCache.current[cacheKey];
    }

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

  const fetchPendingOrders = async () => {
    try {
      const response = await api.get('http://localhost:8000/orders/status/Pending');
      const orders = Array.isArray(response.data) ? response.data : [];

      const currentOrderIds = new Set(orders.map(order => order.id));
      const newOrders = [...currentOrderIds].filter(id => !prevOrderIds.current.has(id));
      if (newOrders.length > 0 && prevOrderIds.current.size > 0) {
        playNotificationSound();
      }
      prevOrderIds.current = currentOrderIds;

      const ordersWithUserInfo = await Promise.all(
        orders.map(async (order) => {
          const userInfo = await fetchUserInfo(order.user_id, order.guest_user_id);
          return { ...order, ...userInfo };
        })
      );

      setPendingOrders(ordersWithUserInfo);
    } catch (error) {
      if (error.response?.status === 404) {
        // Treat 404 as empty list
        setPendingOrders([]);
        console.warn('No pending orders found.');
      } else {
        console.error('Error fetching pending orders:', error);
      }
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, );

  const handleDecline = (orderId) => {
    setSelectedOrderId(orderId);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

const confirmDecline = async () => {
  try {
    await api.put(`http://localhost:8000/orders/${selectedOrderId}/status`, {
      order_status: 'Declined',
    });

    await api.put(`http://localhost:8000/orders/reason`, {
      order_id: selectedOrderId,
      reason: declineReason,
    });

    console.log(`Order ${selectedOrderId} declined with reason: ${declineReason}`);
    await fetchPendingOrders(); // ✅ Keep this
  } catch (error) {
    console.error(`Error declining order ${selectedOrderId}:`, error);
  } finally {
    setShowDeclineModal(false); // ✅ Close modal
    setSelectedOrderId(null);   // ✅ Reset state
  }
};


const confirmAccept = async () => {
  try {
    await api.put(`http://localhost:8000/orders/${selectedAcceptOrderId}/status`, {
      order_status: 'Accepted',
    });
    console.log(`Order ${selectedAcceptOrderId} accepted`);
     window.location.reload(); // Force refresh
    fetchPendingOrders();
  } catch (error) {
    console.error(`Error accepting order ${selectedAcceptOrderId}:`, error);
  } finally {
    setShowAcceptModal(false);
    setSelectedAcceptOrderId(null);
  }
};


  const filteredOrders = pendingOrders.filter(order => {
  const orderDate = order?.created_datetime?.split('T')[0] || '';

    if (fromDate && orderDate < fromDate) return false;
    if (toDate && orderDate > toDate) return false;

    if (filterType === 'name') {
      return order.name.toLowerCase().includes(searchValue.toLowerCase());
    } else if (filterType === 'phone') {
      return order.phone_number.includes(searchValue);
    } else if (filterType === 'date') {
      return order.created_datetime.startsWith(searchValue);
    }

    return true;
  });

const groupedOrders = filteredOrders.reduce((groups, order) => {
  const dateKey = order?.created_datetime?.split('T')[0] || 'Unknown Date';

    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(order);
    return groups;
  }, {});

return (
  <div className="pending-orders-container">
    <h1 className="pending-orders-title">Pending Orders</h1>

    <div className="search-filters">
      <select
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setSearchValue('');
          setFromDate('');
          setToDate('');
        }}
      >
        <option value="">Select Filter</option>
        <option value="name">Search by Name</option>
        <option value="phone">Search by Phone</option>
        <option value="dateRange">Search by Date Range</option>
      </select>

      {(filterType === 'name' || filterType === 'phone') && (
        <input
          type="text"
          placeholder={`Enter ${filterType === 'name' ? 'Name' : 'Phone'}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      )}

      {filterType === 'dateRange' && (
        <>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </>
      )}
    </div>

    {Object.keys(groupedOrders).length === 0 ? (
      <p className="no-orders-message">No pending orders found.</p>
    ) : (
      Object.entries(groupedOrders).map(([date, orders]) => (
        <div key={date}>
          <h2 className="order-date-heading">{date}</h2>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Phone Number:</strong> {order.phone_number}</p>
                <p><strong>Total Price: ₹{Math.round(order.total_price)}</strong> </p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>City:</strong> {order.city}</p>
                <p><strong>State:</strong> {order.state}</p>
                <p><strong>Payment Method:</strong> {order.payment_method}</p>
                <p><strong>Payment Status:</strong> {order.payment_status}</p>
                <p><strong>Is Paid:</strong> {order.is_paid ? 'Yes' : 'No'}</p>
                <p><strong>Created Date:</strong> {new Date(order.created_datetime).toLocaleString()}</p>

                <div className="order-items">
                  <h4>Items:</h4>
{(order.items || []).map((item, index) => {
  const total = item.total_price || 0;
  const discount = item.discount || 0;
  const additional = item.additional_discount || 0;

  // Calculate final price
  const final_price = Math.round(
    total * (1 - discount / 100) * (1 - additional / 100)
  );

  return (
    <div key={index} className="order-item">
      <img
        src={`http://localhost:8000/${item.product_image.replace(/\\/g, '/')}`}
        alt={item.item_name}
        className="item-image"
        onClick={() => fetchItemDetails(item.item_id)}
        style={{ cursor: 'pointer' }}
      />
      <div>
        <p><strong>{item.item_name}</strong></p>
        <p>Qty: {item.quantity}</p>
        <p>Unit Price after discount: ₹{item.unit_price}</p>
        <p>Additional Discount: {item.additional_discount}%</p>
        <p><strong>Total Price: ₹{item.total_price}</strong></p>
        {item.note && <p><strong>Note:</strong> {item.note}</p>}
      </div>
    </div>
  );
})}

                </div>

                <div className="order-actions">
                  <button
                    className="accept-button"
              onClick={() => {
                setSelectedAcceptOrderId(order.id);
                setShowAcceptModal(true);
              }}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-button"
                    onClick={() => handleDecline(order.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    )}

    {/* Decline Modal */}
    {showDeclineModal && (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>Decline Reason</h3>
          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Enter reason for declining the order"
            rows="4"
          />
          <div className="modal-buttons">
            <button onClick={() => setShowDeclineModal(false)}>Cancel</button>
            <button
              disabled={!declineReason.trim()}
              onClick={confirmDecline}
            >
              Confirm Decline
            </button>
          </div>
        </div>
      </div>
    )}
    {showAcceptModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Confirm Accept</h3>
      <p>Are you sure you want to accept this order?</p>
      <div className="modal-buttons">
        <button onClick={() => setShowAcceptModal(false)}>Cancel</button>
        <button onClick={confirmAccept}>Confirm Accept</button>
      </div>
    </div>
  </div>
)}


    {/* Item Details Modal */}
    {showItemModal && selectedItemDetails && (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>{selectedItemDetails.item_name}</h3>
          <img
            src={`http://localhost:8000/${selectedItemDetails.product_image.replace(/\\/g, '/')}`}
            alt={selectedItemDetails.item_name}
            style={{ width: '100%', maxWidth: '300px' }}
          />
          <p><strong>Price:</strong> ₹{selectedItemDetails.item_price}</p>
          <p><strong>Discount:</strong> {selectedItemDetails.discount}%</p>
          <p><strong>Final Price:</strong> ₹{selectedItemDetails.final_price}</p>
          <p><strong>Quantity:</strong> {selectedItemDetails.quantity}</p>
          <p><strong>Quality:</strong> {selectedItemDetails.quality}</p>
          <p><strong>Description:</strong> {selectedItemDetails.description}</p>
          <button onClick={() => setShowItemModal(false)}>Close</button>
        </div>
      </div>
    )}
  </div>
);

};

export default PendingOrders;
