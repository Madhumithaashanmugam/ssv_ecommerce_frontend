// src/services/guestUserService
import axios from 'axios';

export const createGuestUser = async (guestData) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/guest-user/guest-user/create", guestData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGuestDetailsById = async (guestId) => {
  const response = await axios.get(`http://localhost:8000/guest-user/guest-user/id/${guestId}`);
  return response.data;
};


