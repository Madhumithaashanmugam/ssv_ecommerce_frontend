import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/vendor';

export const vendorLogin = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/vendor/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};
