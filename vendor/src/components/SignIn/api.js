import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
});

// Helper to decode JWT expiry (for debugging)
function logTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryDate = new Date(payload.exp * 1000);
    console.log("🔐 Token Expires At:", expiryDate.toLocaleString());
  } catch (e) {
    console.warn("⚠️ Unable to decode token:", e);
  }
}

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    logTokenExpiry(token); // Optional: comment this out in production
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle Expired/Invalid Token
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    console.error("⛔ Unauthorized (401):", error.response?.data || "No details");
    localStorage.removeItem('token');
    window.location.href = '/vendor-signin';
  }
  return Promise.reject(error);
});

export default api;
