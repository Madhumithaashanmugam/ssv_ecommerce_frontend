// src/components/Services.js
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

// Working path from FastAPI logs: /api/customer/auth/customer/auth/login
export const customerLogin = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await axios.post(`${API_BASE}/api/customer/auth/customer/auth/login`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return response.data;
};
