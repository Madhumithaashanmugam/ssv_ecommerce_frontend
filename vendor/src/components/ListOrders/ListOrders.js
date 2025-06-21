import React, { useEffect, useState } from 'react';
import api from '../SignIn/api';
import './ListOrders.css';
import { useNavigate } from 'react-router-dom';


const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterByBalance, setFilterByBalance] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [itemDetails, setItemDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    payment_status: '',
    payment_method: '',
    total_amount: '',
    amount_paid: '',
    notes: ''
  });

  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filterByBalance, searchTerm, filterType]);

const fetchOrders = async () => {
  try {
    const response = await api.get('offline-order/');
    const ordersData = response.data.filter(order => !order.is_returned);

    setOrders(ordersData);
    // ...


    const uniqueItemIds = [
      ...new Set(ordersData.flatMap(order => order.items.map(item => item.item_id)))
    ];

    const itemDetailsMap = {};
    await Promise.all(
      uniqueItemIds.map(async (id) => {
        try {
          const res = await api.get(`items/${id}`);
          itemDetailsMap[id] = res.data;
        } catch (err) {
          console.error(`Error fetching item ${id}:`, err);
        }
      })
    );
    setItemDetails(itemDetailsMap);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const applyFilters = () => {
let filtered = orders.filter(order => !order.is_returned);

  if (filterByBalance === 'due') {
    // Use Math.floor to ignore decimal fractions like 0.0008
     filtered = filtered.filter(order => order.balance_due >= 1);
  }

  const value = searchTerm.toLowerCase();
  filtered = filtered.filter(order => {
    if (filterType === 'name') return order.customer_name?.toLowerCase().includes(value);
    if (filterType === 'phone') return order.customer_phone?.includes(value);
    if (filterType === 'date') {
      const date = new Date(order.order_date).toLocaleDateString();
      return date.includes(value);
    }
    return true;
  });

  filtered.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
  setFilteredOrders(filtered);
};

  const groupOrdersByDate = (ordersList) => {
    return ordersList.reduce((acc, order) => {
      const dateKey = new Date(order.order_date).toLocaleDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(order);
      return acc;
    }, {});
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      payment_status: order.payment_status || '',
      payment_method: order.payment_method || '',
      total_amount: order.total_amount || '',
      amount_paid: order.amount_paid || '',
      notes: order.notes || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`offline-order/${selectedOrder.id}`, formData);
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleReturnConfirm = async () => {
    try {
      await api.put(`offline-order/orders/return-status`, {
        order_id: selectedOrder.id,
        is_returned: true
      });
      setShowReturnConfirm(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error marking return:', error);
    }
  };

  const groupedOrders = groupOrdersByDate(filteredOrders);

  return (
    <div className="list-orders-container">
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
      <h2>List of Orders</h2>

      <div className="filters">
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

        <select value={filterByBalance} onChange={(e) => setFilterByBalance(e.target.value)}>
          <option value="all">All Orders</option>
          <option value="due">Balance Due Only</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {Object.entries(groupedOrders).map(([date, ordersOnDate]) => (
            <div key={date}>
              <h2 className="date-heading">{date}</h2>
              <div className="orders-grid">
                {ordersOnDate.map(order => (
                  <div key={order.id} className="order-card">
                    <h3>{order.customer_name} ({order.customer_phone})</h3>
                    <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
                    <p><strong>Delivery Date:</strong> {order.delivery_date}</p>
                    <p><strong>Payment Status:</strong> {order.payment_status} ({order.payment_method})</p>
                    <p><strong>Total:</strong> ₹{Math.floor(order.total_amount).toLocaleString('en-IN')}</p>
                    <p><strong>Discount:</strong> ₹{order.discount}</p>
                    <p style={{ color: Math.floor(order.amount_paid) >= Math.floor(order.total_amount) ? 'green' : 'black' }}>
                      <strong>Amount Paid:</strong> ₹{Math.floor(order.amount_paid)}
                    </p>
                    {Math.floor(order.amount_paid) < Math.floor(order.total_amount) && (
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        <strong>Balance Due:</strong> ₹{Math.floor(order.balance_due)}
                      </p>
                    )}
                    <p><strong>Notes:</strong> {order.notes}</p>
                    <p><strong>Returned:</strong> {order.is_returned ? '✅ Yes' : '❌ No'}</p>

                    <p><strong>Items Ordered:</strong></p>
                    <ul className="items-list">
                      {order.items.map(item => {
                        const detail = itemDetails[item.item_id];
                        return (
                          <li key={item.item_id} className="item-row">
                            {detail ? (
                              <>
                                <img
                                  src={`http://127.0.0.1:8000/${detail.product_image.replace(/\\/g, '/')}`}
                                  alt={detail.item_name}
                                  className="item-image"
                                />
                                <div className="item-info">
                                  <p><strong>{detail.item_name}</strong></p>
                                  <p>Quantity: {item.quantity} | Kg: {detail.kg}</p>
                                </div>
                              </>
                            ) : (
                              <p>Item ID: {item.item_id}, Quantity: {item.quantity}</p>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    <button onClick={() => openModal(order)}>Update Order</button>
                    {!order.is_returned && (
                      <button style={{ marginTop: '8px' }} onClick={() => {
                        setSelectedOrder(order);
                        setShowReturnConfirm(true);
                      }}>
                        Mark as Returned
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update Order</h3>

            <label>Payment Status:
              <select name="payment_status" value={formData.payment_status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
            </label>

            <label>Payment Method:
              <select name="payment_method" value={formData.payment_method} onChange={handleChange}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </label>

            <label>Total Amount:
              <input name="total_amount" type="number" value={formData.total_amount} onChange={handleChange} />
            </label>

            <label>Amount Paid:
              <input name="amount_paid" type="number" value={formData.amount_paid} onChange={handleChange} />
            </label>

            <label>Notes:
              <textarea name="notes" value={formData.notes} onChange={handleChange} />
            </label>

            <div className="modal-buttons">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {showReturnConfirm && selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Return</h3>
            <p>Are you sure you want to mark this order as returned?</p>
            <div className="modal-buttons">
              <button onClick={handleReturnConfirm}>Yes, Mark as Returned</button>
              <button onClick={() => {
                setShowReturnConfirm(false);
                setSelectedOrder(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
