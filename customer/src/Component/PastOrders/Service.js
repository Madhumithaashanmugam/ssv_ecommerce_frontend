import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const getOrdersByStatus = async (customerId, guestId, token, status) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/user`,
      {
        user_id: customerId || null,
        guest_user_id: guestId || null,
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${status} orders:`, error);
    throw error;
  }
};

// ✅ Fixed this function
export const getOrderById = async (orderId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching order by ID ${orderId}:`, error);
    return null;
  }
};
