// analytics.service.js
import api from "../SignIn/api"; // Make sure this path points to your api.js

// Fetch analytics data (JWT is automatically attached via interceptor in api.js)
export const fetchAnalytics = async () => {
  try {
    const response = await api.get('/analytics/analytics');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching analytics:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
