// src/components/Services/itemService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Update if needed

export const fetchItemsWithCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories/with-items`);
  return response.data;
};

export const fetchItemsByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items by category ID:', error);
    throw error;
  }
};