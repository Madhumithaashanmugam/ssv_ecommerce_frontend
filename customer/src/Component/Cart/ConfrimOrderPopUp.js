// src/components/ConfirmOrderPopup.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const ConfirmOrderPopup = ({ userInfo, guestDetails, addressList, onConfirm, onCancel }) => {
  const navigate = useNavigate();

  const name = userInfo?.name || guestDetails?.name || 'User';
  const address = guestDetails
    ? {
        line1: guestDetails.plot_number,
        line2: guestDetails.street_line,
        city: guestDetails.city,
        state: guestDetails.state,
        zip: guestDetails.zip_code
      }
    : addressList?.[0]
    ? {
        line1: addressList[0].address_line,
        line2: addressList[0].extra_details,
        city: addressList[0].city,
        state: addressList[0].state,
        zip: addressList[0].zip_code
      }
    : null;

  const handleUpdateClick = () => {
    navigate('/user-details');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Confirm Your Order</h2>

        <div className="popup-field">
          <label>Hi,</label>
          <div>{name} 👋</div>
        </div>

        {address ? (
          <div className="popup-field">
            <label>Delivery Address:</label>
            <div>{address.line1}</div>
            {address.line2 && <div>{address.line2}</div>}
            <div>{address.city}, {address.state} - {address.zip}</div>
          </div>
        ) : (
          <div className="popup-field">
            <label>Delivery Address:</label>
            <div>No address found. Please add one.</div>
          </div>
        )}

        <div className="popup-actions">
          <button className="update-button" onClick={handleUpdateClick}>✏️ Update</button>
          <button className="confirm-button" onClick={onConfirm}>✅ Confirm</button>
          <button className="cancel-button" onClick={onCancel}>❌ Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPopup;
