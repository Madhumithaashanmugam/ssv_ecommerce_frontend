// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const createVendorUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendor/users/`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating vendor user:', error);
    throw error;
  }
};
