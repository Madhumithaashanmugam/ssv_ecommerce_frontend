// src/services/itemService.js
import api from '../SignIn/api';


const BASE_URL = 'http://127.0.0.1:8000/items/'; // Adjust base URL as needed

export const createItem = async (formData) => {
  try {

    const response = await api.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error creating item:', error);
    throw error;
  }
};


// service.js or wherever you define the API calls

export const getItems = async () => {
  try {
    const response = await api.get(BASE_URL); // removed skip and limit
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

