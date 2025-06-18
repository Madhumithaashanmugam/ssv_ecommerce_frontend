import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import ConfirmOrderPopup from './ConfrimOrderPopUp';
import { AuthContext } from '../Context/AuthContext';
import { fetchAddressByCustomerId } from '../UserDetails/Service';
import { createOrder } from '../Order/service';

const OrderNowButton = ({ userInfo, cart }) => {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const [showOptions, setShowOptions] = useState(false);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [guestDetails, setGuestDetails] = useState(null);
  const [addressList, setAddressList] = useState([]);

  const guestUserId = localStorage.getItem('guest_user_id');

  useEffect(() => {
    const fetchGuest = async () => {
      if (guestUserId) {
        try {
          const res = await fetch(`http://localhost:8000/guest-user/guest-user/id/${guestUserId}`);
          const data = await res.json();
          setGuestDetails(data);
        } catch (err) {
          console.error('Guest fetch error:', err);
        }
      }
    };

    const fetchCustomerAddress = async () => {
      const customerId = userInfo?.id;
      if (authToken && customerId) {
        try {
          const addresses = await fetchAddressByCustomerId(customerId);
          setAddressList(addresses);
        } catch (err) {
          console.error('Address fetch error:', err);
        }
      }
    };

    if (!authToken && guestUserId) fetchGuest();
    if (authToken) fetchCustomerAddress();
  }, [authToken, guestUserId, userInfo]);

  const isLoggedInUser = userInfo?.user_id || userInfo?.id || guestUserId;
  const hasItemsInCart = cart?.items?.length > 0;

  const handleOrderNowClick = () => {
    setShowOptions(true);
    setShowOnlineMessage(false);
  };

  const handleOnlineClick = () => {
    setShowOnlineMessage(true);
  };

  const handleCODClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const deleteCart = async () => {
    try {
      await fetch(`http://localhost:8000/cart/cart/cart/${cart.cart_id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete cart error:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      const outOfStockItem = cart.items.find(
        (item) => item.quantity > item.available_stock
      );

      if (outOfStockItem) {
        alert(`Item "${outOfStockItem.item_name}" is out of stock`);
        return;
      }

      const orderAddress = guestDetails
        ? {
            address: guestDetails.street_line || guestDetails.plot_number || '',
            city: guestDetails.city || '',
            state: guestDetails.state || ''
          }
        : addressList?.[0]
        ? {
            address: addressList[0].address_line || addressList[0].extra_details || '',
            city: addressList[0].city || '',
            state: addressList[0].state || ''
          }
        : { address: '', city: '', state: '' };

      const orderData = {
        user_id: authToken ? userInfo?.user_id || userInfo?.id : null,
        guest_user_id: !authToken ? guestUserId : null,
        items: cart.items.map((item) => {
          const unitPrice = item.unit_price || item.item_price || 0;
          const quantity = item.quantity;
          const baseDiscount = item.cart_discount || 0;
          const additionalDiscount = quantity > 5 ? 10 : 0;

          return {
            item_id: item.item_id,
            item_name: item.name || item.item_name || '',
            item_price: item.item_price || unitPrice,
            mrp_price: item.mrp_price || 0,
            unit_price: unitPrice,
            quantity: quantity,
            discount: baseDiscount,
            additional_discount: additionalDiscount, // for backend
            product_image: item.product_image || '',
            note: additionalDiscount > 0 ? 'Extra 10% off due to bulk quantity' : null
          };
        }),
        payment_method: 'Cash On Delivery',
        address: orderAddress.address,
        city: orderAddress.city,
        state: orderAddress.state
      };

      await createOrder(orderData);
      await deleteCart();
      setShowPopup(false);
      navigate('/order-success');
    } catch (error) {
      console.error('Order error:', error);
    }
  };

  if (!isLoggedInUser || !hasItemsInCart) {
    return null;
  }

  return (
    <div className="order-now-container">
      {!showOptions ? (
        <button className="order-now-button" onClick={handleOrderNowClick}>
          🍭️ Order Now
        </button>
      ) : (
        <div className="payment-options">
          <button className="cod-button" onClick={handleCODClick}>
            🚚 Cash on Delivery
          </button>
          <button className="online-button" onClick={handleOnlineClick}>
            💳 Online (Coming Soon)
          </button>
        </div>
      )}

      {showOnlineMessage && (
        <p className="online-message">
          ⚠️ Online payment is currently unavailable. Please select Cash on Delivery.
        </p>
      )}

      {showPopup && (
        <ConfirmOrderPopup
          userInfo={userInfo}
          guestDetails={guestDetails}
          addressList={addressList}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default OrderNowButton;