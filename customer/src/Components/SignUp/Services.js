// src/services/customerService.js
import axios from 'axios';

const CUSTOMER_API = 'http://localhost:8000/api/customer/users/customer/users/';


export const createCustomerUser = async (userData) => {
  try {
    const response = await axios.post(`${CUSTOMER_API}`, userData);
    return response.data;
  } catch (error) {
    console.error('❌ Customer sign up error:', error);
    throw error;
  }
};
