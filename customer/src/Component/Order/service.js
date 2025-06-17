// src/pages/OrderService.js
import axios from 'axios';

export const createOrder = async (orderData) => {
  const response = await axios.post('http://127.0.0.1:8000/orders/', orderData);
  return response.data;
};

export const fetchOrdersByStatus = async (customerId, status) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/orders/customer/${customerId}?status=${status}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No orders found for this status
      return { orders: [] };
    }
    throw error; // Some other error occurred
  }
};
