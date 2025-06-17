// src/pages/UserDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserDetails.css';


const UserDetails = () => {
  const { authData, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!authData?.user?.id || !authData?.token) {
          setError('Not logged in');
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/vendor/users/${authData.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );
        setUserDetails(response.data);
      } catch (err) {
        setError('Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, [authData]);

  if (!authData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>You are not logged in.</p>
        <button onClick={() => navigate('/vendor-signin')}>
          Go to Sign In
        </button>
      </div>
    );
  }

  if (error) return <p>{error}</p>;
  if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="user-details-container" style={{ padding: '1rem' }}>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {userDetails.name || 'N/A'}</p>
      <p><strong>Email:</strong> {userDetails.email || 'N/A'}</p>
      <p><strong>Phone Number:</strong> {userDetails.phone_number}</p>
      <p><strong>Created:</strong> {new Date(userDetails.created_datetime).toLocaleString()}</p>
      
      <button onClick={logout} style={{ marginTop: '1rem' }}>
        Logout
      </button>
    </div>
  );
};

export default UserDetails;
