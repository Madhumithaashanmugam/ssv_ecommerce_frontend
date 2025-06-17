// src/components/UpdateGuest.js
import React, { useState } from 'react';
import './UserDetails.css';
import { updateGuestUser } from './Service';

const UpdateGuest = ({ guestDetails, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: guestDetails.name || '',
    email: guestDetails.email || '',
    phone_number: guestDetails.phone_number || '',
    street_line: guestDetails.street_line || '',
    plot_number: guestDetails.plot_number || '',
    city: guestDetails.city || '',
    state: guestDetails.state || '',
    zip_code: guestDetails.zip_code || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = await updateGuestUser(guestDetails.id, formData);
      alert('Guest updated successfully!');
      onUpdated(updatedData);
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Update failed!');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Update Guest Info</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div key={field} className="form-group">
              <label>{field.replace('_', ' ')}:</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGuest;
