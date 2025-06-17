// src/Component/Cart/CartService.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const createCart = async (cartData) => {
  try {
    const response = await axios.post(`${BASE_URL}/cart/cart/add`, cartData);

    // If guest cart, store ID in localStorage
    if (!cartData.customer_id && response.data.cart_id) {
      localStorage.setItem('guest_cart_id', response.data.cart_id);
    }

    return response.data;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};


// Fetch cart based on customer ID (logged-in) or guest cart ID
export const fetchCartByIdentifier = async (customerId, guestCartId) => {
  try {
    let url = '';

    if (customerId) {
      url = `${BASE_URL}/cart/cart/get?customer_id=${customerId}`;
    } else if (guestCartId) {
      url = `${BASE_URL}/cart/cart/get?cart_id=${guestCartId}`;
    } else {
      console.error("No valid identifier provided (customer_id or guestCartId).");
      return null;
    }

    console.log("Fetching cart with URL:", url); // Debug log
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};


export const placeOrder 
 = async (orderData, authToken = null) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/orders', orderData, {
      headers: authToken
        ? { Authorization: `Bearer ${authToken}` }
        : undefined,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw error;
  }
};

