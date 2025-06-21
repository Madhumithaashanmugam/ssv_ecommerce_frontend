// src/components/Service.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/customer/users';
const ADDRESS_API_URL = 'http://127.0.0.1:8000/address';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    throw error;
  }
};

export const fetchAddressByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${ADDRESS_API_URL}/customer/${customerId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch address:', error);
    return [];
  }
};

export const createAddress = async (data) => {
  try {
    const response = await axios.post(`${ADDRESS_API_URL}/`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Failed to create address:', error);
    throw error;
  }
};

export const updateAddress = async (addressId, data) => {
  try {
    const response = await axios.put(`${ADDRESS_API_URL}/${addressId}`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Failed to update address:', error);
    throw error;
  }
};

// export const updateUserDetails = async (userId, userData) => {
//   const token = localStorage.getItem('token');

//   console.log('Updating user with ID:', userId);
//   console.log('Payload:', userData);  // <-- log the data being sent

//   try {
//     const response = await axios.put(
//       `http://127.0.0.1:8000/api/customer/users/customer/users/${userId}`,
//       userData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Failed to update user:", error.response?.data || error.message);
//     if (error.response?.data?.detail) {
//       console.error("Validation errors:", error.response.data.detail);
//     }
//     throw error;
//   }
// };




export const updateUserDetails = async (userId, userData) => {
  const res = await axios.put(
    `http://127.0.0.1:8000/api/customer/users/customer/users/user/${userId}`,
    userData
  );
  return res.data;
};




export const updateGuestUser = async (guestUserId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:8000/guest-user/guest-user/update/${guestUserId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating guest user:", error);
    throw error;
  }
};