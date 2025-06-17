import React, { useState, useEffect } from 'react';
import './style.css'; // Add styles here or inline if preferred

const CartItemControls = ({ item, cartId, onUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quantity !== item.quantity) {
      const delay = setTimeout(() => {
        handleUpdate();
      }, 400); // debounce
      return () => clearTimeout(delay);
    }
  }, [quantity]);

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      await onUpdate(cartId, item.item_id, quantity);
    } catch (err) {
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="quantity-wrapper">
      <button onClick={decreaseQuantity} disabled={loading}>-</button>
      <div className="quantity-display">{quantity}</div>
      <button onClick={increaseQuantity} disabled={loading}>+</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default CartItemControls;
