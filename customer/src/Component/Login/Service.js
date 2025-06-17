import axios from 'axios';

const API_URL = 'http://localhost:8000/api/customer/auth/customer/auth/login'; // adjust as per your setup

export const loginCustomer = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await axios.post(API_URL, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
};
