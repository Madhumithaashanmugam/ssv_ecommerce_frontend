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
    phone_number: ''
  });

  useEffect(() => {
    console.log("UserInfo:", userInfo);
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone_number: userInfo.phone_number || ''
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

      await updateUserDetails(userId, formData);
      alert("User updated successfully");
      navigate('/user-details');
    } catch (error) {
      console.error("Failed to update user:", error);
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
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
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
    </div>
  );
}

export default UpdateUser;
