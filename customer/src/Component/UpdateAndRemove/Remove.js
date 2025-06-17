import React, { useContext } from 'react';
import { removeCartItem } from './service';
import { AuthContext } from '../Context/AuthContext';

const RemoveButton = ({ item, cartId, customerId, onRemove }) => {
  const { userInfo } = useContext(AuthContext);

  const handleRemove = async () => {
    try {
      const payload = {
        cart_id: cartId,
        item_id: item.item_id,
        customer_id: customerId || null,
        guest_user_id: null
      };

      // ✅ Only assign guest_user_id if user is truly a guest
      const guestId = localStorage.getItem('guest_user_id');
      if (userInfo?.email === 'guest@example.com' && guestId) {
        payload.guest_user_id = guestId;
      }

      await removeCartItem(payload);

      onRemove(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(i => i.item_id !== item.item_id),
        total_cart_price: prevCart.total_cart_price - item.total_price,
      }));
    } catch (error) {
      console.error('❌ Error removing item:', error);
      alert('Failed to remove item from cart.');
    }
  };

  return (
    <button className="remove-button" onClick={handleRemove}>
      ❌ Remove
    </button>
  );
};

export default RemoveButton;
