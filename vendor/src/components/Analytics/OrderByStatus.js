import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrdersByStatus = () => {
  const { status } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersByStatus = async () => {
      const token = localStorage.getItem("vendorToken");
      if (!token) {
        console.error("No vendor token found.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8000/vendor/orders/status/${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch vendor orders by status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByStatus();
  }, [status]);

  if (loading) return <div>Loading vendor orders with status "{status}"...</div>;

  return (
    <div className="orders-status-page">
      <h2>Vendor Orders with Status: {status}</h2>
      {orders.length === 0 ? (
        <p>No orders found for this status.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>₹{order.total_price}</td>
                <td>{order.order_status}</td>
                <td>{new Date(order.created_datetime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersByStatus;
