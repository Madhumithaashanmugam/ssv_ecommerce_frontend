// src/components/UpdateUser.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateUser.css';
import { updateUserDetails } from './Service';
import { AuthContext } from '../Context/AuthContext';

function UpdateUser() {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    created_datetime: '', // required by backend
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone_number: userInfo.phone_number || '',
        created_datetime: userInfo.created_datetime || new Date().toISOString(), // Fallback
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = userInfo?.id;
      if (!userId) {
        alert("User ID is missing. Cannot update user.");
        return;
      }

      const payload = {
        ...formData,
        updated_datetime: new Date().toISOString(), // ⏱ Required by backend
      };

      await updateUserDetails(userId, payload);
      alert("User updated successfully");
      navigate('/user-details');
    } catch (error) {
      console.error("Failed to update user:", error.response?.data || error.message);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
  <div className="update-user-container">
    <h2>Update Your Details</h2>
    <form className="update-user-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone_number"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={handleChange}
      />
      <button type="submit">Update</button>
    </form>

    {/* 👉 Add this below the form */}
    <button
      className="change-password-button"
      onClick={() => navigate('/')}
    >
      🔒 Change Password
    </button>
  </div>
);

}

export default UpdateUser;
