// Example updateCartItem function (in service.js)
import axios from 'axios';

export const updateCartItem = async ({ cart_id, item_id, quantity }) => {
  const response = await axios.put('http://127.0.0.1:8000/cart/cart/update-quantity', {
    cart_id: String(cart_id),
    item_id: String(item_id),
    quantity: Number(quantity),
  });
  return response.data;
};


// src/UpdateAndRemove/RemoveItemService.js
export const removeCartItem = async ({ cart_id, item_id, customer_id, guest_user_id }) => {
  try {
    const bodyPayload = {
      cart_id,
      item_id,
      customer_id,
      guest_user_id,
    };


    const response = await fetch('http://127.0.0.1:8000/cart/cart/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Server error:", data);
      throw new Error(data.message || 'Failed to remove cart item');
    }

    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
};
