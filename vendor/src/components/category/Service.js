// src/services/categoryService.js
import api from "../SignIn/api";
const CATEGORY_URL = '/categories/';

/**
 * Creates a new category by sending a POST request.
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(CATEGORY_URL, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category', error);
    throw error;
  }
};

/**
 * Retrieves all categories (no skip, no limit).
 */
export const listCategories = async () => {
  try {
    const response = await api.get(CATEGORY_URL); // ❌ No pagination params
    return response.data;
  } catch (error) {
    console.error('Error fetching categories', error);
    throw error;
  }
};
