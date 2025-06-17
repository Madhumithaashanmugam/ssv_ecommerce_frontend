import { useEffect, useState } from 'react';
import axios from 'axios';

const useCart = (userInfo) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const fetchCart = async () => {
  try {
    setLoading(true);
    setError('');

    const customer_id = localStorage.getItem('customer_id');
    const cart_id = localStorage.getItem('guest_cart_id');
    const guest_user_id = localStorage.getItem('guest_user_id');

    const params = {};

    if (customer_id) {
  params.customer_id = customer_id;
  // Cleanup
  localStorage.removeItem('guest_user_id');
  localStorage.removeItem('guest_cart_id');
} else if (cart_id) {
  params.cart_id = cart_id;
} else if (guest_user_id) {
  params.guest_user_id = guest_user_id;
}

    if (Object.keys(params).length === 0) {
      setError('No valid cart identifier found.');
      setLoading(false);
      return;
    }


    const response = await axios.get('http://localhost:8000/cart/cart/get', {
      params,
    });

    setCart(response.data);
  } catch (err) {
    setError('Failed to fetch cart. Please try again later.');
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchCart();
  }, [userInfo]);

  const handleUpdateQuantity = async (cartId, itemId, newQuantity) => {
    try {
      await axios.put('http://localhost:8000/cart/cart/update-quantity', {
        cart_id: cartId,
        item_id: itemId,
        quantity: newQuantity,
      });
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  return { cart, loading, error, handleUpdateQuantity, setCart };
};

export default useCart;
