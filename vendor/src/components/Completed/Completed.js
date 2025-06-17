import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../SignIn/api';
import './CompletedOrder.css';

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orderToReturn, setOrderToReturn] = useState(null);

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
    } catch (err) {
      console.error('Error fetching user info:', err);
      return { name: 'Unknown', phone_number: 'Unknown' };
    }
  };

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await api.get('orders/status/Completed');
        const data = Array.isArray(response.data[0]) ? response.data[0] : response.data;

        const dataWithUserInfo = await Promise.all(
          data.map(async (order) => {
            const userInfo = await fetchUserInfo(order.user_id, order.guest_user_id);
            return { ...order, ...userInfo };
          })
        );

        setOrders(dataWithUserInfo);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const createdDate = new Date(order.created_datetime).toISOString().split('T')[0];
      if (fromDate && createdDate < fromDate) return false;
      if (toDate && createdDate > toDate) return false;

      const value = searchQuery.toLowerCase();
      if (searchType === 'name') return order.name.toLowerCase().includes(value);
      if (searchType === 'phone') return order.phone_number.includes(value);
      return true;
    });

    const grouped = {};
    filtered.forEach(order => {
      const date = new Date(order.created_datetime).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(order);
    });

    setFilteredOrders(grouped);
  }, [orders, searchQuery, searchType, fromDate, toDate]);

  const handleReturnedClick = (orderId) => {
    setOrderToReturn(orderId);
    setShowModal(true);
  };

  const confirmReturn = async () => {
    try {
      await api.put(`orders/${orderToReturn}/status`, {
        order_status: 'Returned',
      });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderToReturn ? { ...order, order_status: 'Returned' } : order
        )
      );
       window.location.reload();
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
    } finally {
      setShowModal(false);
      setOrderToReturn(null);
    }
  };

  const exportToExcel = (orders, date) => {
    const rows = orders.map(order => ({
      ID: order.id,
      Name: order.name,
      Phone: order.phone_number,
      Total: order.total_price,
      Address: `${order.address}, ${order.city}, ${order.state}`,
      Status: order.order_status,
      Payment_Method: order.payment_method,
      Payment_Status: order.payment_status,
      Created_At: new Date(order.created_datetime).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `Completed_Orders_${date}.xlsx`);
  };

  if (loading) return <div>Loading completed orders...</div>;

  return (
    <div className="completed-orders-container">
      <h2>Completed Orders</h2>

      <div className="search-filters">
        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="all">All</option>
          <option value="name">Search by Name</option>
          <option value="phone">Search by Phone Number</option>
        </select>

        {searchType !== 'all' && (
          <input
            type="text"
            placeholder={`Enter ${searchType}`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        )}

        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
      </div>

      {Object.keys(filteredOrders).length === 0 ? (
        <p>No completed orders found.</p>
      ) : (
        Object.entries(filteredOrders).map(([date, orders]) => (
          <div key={date}>
            <div className="date-header">
              <h3 className="order-date-heading">{date}</h3>
              <button className="excel-button" onClick={() => exportToExcel(orders, date)}>
                Export to Excel
              </button>
            </div>
            <div className="orders-grid">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Phone Number:</strong> {order.phone_number}</p>
                  <p><strong>Total Price:</strong> ₹{order.total_price}</p>
                  <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}</p>
                  <p><strong>Order Status:</strong> {order.order_status}</p>
                  <p><strong>Payment Method:</strong> {order.payment_method}</p>
                  <p><strong>Payment Status:</strong> {order.payment_status}</p>
                  <p><strong>Created At:</strong> {new Date(order.created_datetime).toISOString()}</p>
<p><strong>Updated At:</strong> {new Date(order.updated_datetime).toISOString()}</p>

                  <div className="items-list">
                    <h4>Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="item-details">
                        <p><strong>Name:</strong> {item.item_name}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Unit Price:</strong> ₹{item.unit_price}</p>
                        <p><strong>Total:</strong> ₹{item.total_price}</p>
                        <img
                          src={`http://localhost:8000/${item.product_image.replace(/\\/g, '/')}`}
                          alt={item.item_name}
                          className="product-image"
                        />
                      </div>
                    ))}
                  </div>

                  {order.order_status !== 'Returned' && (
                    <button className="returned-button" onClick={() => handleReturnedClick(order.id)}>
                      Mark as Returned
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to mark this order as <strong>Returned</strong>?</p>
            <div className="modal-buttons">
              <button className="confirm" onClick={confirmReturn}>Yes</button>
              <button className="cancel" onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedOrders;
