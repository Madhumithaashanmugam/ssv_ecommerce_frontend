// src/components/UserDetails.js
import React, { useEffect, useState, useContext } from 'react';
import './UserDetails.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { fetchAddressByCustomerId } from './Service';
import UpdateGuest from './UpdateGuest';

const UserDetails = () => {
  const { userInfo, authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addressList, setAddressList] = useState([]);
  const [guestDetails, setGuestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const loadAddress = async (id) => {
    try {
      const address = await fetchAddressByCustomerId(id);
      setAddressList(address);
    } catch (error) {
      console.error("Error loading address:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestDetails = async (guestUserId) => {
    try {
      const res = await fetch(`http://localhost:8000/guest-user/guest-user/id/${guestUserId}`);
      if (!res.ok) throw new Error('Failed to fetch guest details');
      const data = await res.json();
      setGuestDetails(data);
    } catch (err) {
      console.error('Guest fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogout = () => {
    localStorage.removeItem('guest_user_id');
    localStorage.removeItem('guest_cart_id');
    setGuestDetails(null);
    navigate('/');
  };

  const handleGuestUpdated = (updatedGuest) => {
    setGuestDetails(updatedGuest);
    setShowUpdatePopup(false);
  };

  useEffect(() => {
    const customerId = userInfo?.id || userInfo?.user_id;
    const guestUserId = localStorage.getItem('guest_user_id');

    if (authToken && customerId) {
      loadAddress(customerId);
    } else if (!authToken && guestUserId) {
      fetchGuestDetails(guestUserId);
    } else {
      setLoading(false);
    }
  }, [authToken, userInfo]);

  if (loading) return <div>Loading...</div>;

  // ----------- 👤 Authenticated Customer -------------
  if (authToken && userInfo) {
    return (
      <div className="user-details-container">
        <div className="user-card">
          <h1 className="greeting">
            Welcome, {userInfo.name || userInfo.sub?.split('@')[0]} 👋
          </h1>

          <div className="user-field">
            <label>Email:</label>
            <span>{userInfo.email || userInfo.sub}</span>
          </div>

          <div className="user-field">
            <label>Phone Number:</label>
            <span>{userInfo.phone_number || '+91-9876543210'}</span>
          </div>

          <button
            className="update-user-button"
            onClick={() => navigate('/update-user', { state: { userData: userInfo } })}
          >
            ✏️ Update User
          </button>

          <h2>📍 Address:</h2>
          {addressList.length > 0 ? (
            addressList.map((addr) => (
              <div key={addr.id} className="address-card">
                <p>{addr.address_line}</p>
                <p>{addr.city}, {addr.state} - {addr.zip_code}</p>
                {addr.extra_details && <p>{addr.extra_details}</p>}
                <button
                  className="update-address-button"
                  onClick={() => navigate(`/update-address/${addr.id}`)}
                >
                  ✏️ Update Address
                </button>
              </div>
            ))
          ) : (
            <button
              className="add-address-button"
              onClick={() => navigate('/add-address')}
            >
              ➕ Add Address
            </button>
          )}

          <button className="logout-button" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  // ----------- 👥 Guest User -------------
  if (guestDetails) {
    return (
      <div className="user-details-container">
        <div className="user-card">
          <h1 className="greeting">Welcome, Guest 👋</h1>

          <div className="user-field"><label>ID:</label><span>{guestDetails.id}</span></div>
          <div className="user-field"><label>Name:</label><span>{guestDetails.name}</span></div>
          <div className="user-field"><label>Email:</label><span>{guestDetails.email}</span></div>
          <div className="user-field"><label>Phone Number:</label><span>{guestDetails.phone_number}</span></div>

          <h2>📍 Address:</h2>
          <p>{guestDetails.plot_number}, {guestDetails.street_line}</p>
          <p>{guestDetails.city}, {guestDetails.state} - {guestDetails.zip_code}</p>

          <button className="update-user-button" onClick={() => setShowUpdatePopup(true)}>
            ✏️ Update Guest Info
          </button>

          <button className="logout-button" onClick={handleGuestLogout}>
            🚪 Logout Guest
          </button>
        </div>

        {showUpdatePopup && guestDetails && (
          <UpdateGuest
            guestDetails={guestDetails}
            onClose={() => setShowUpdatePopup(false)}
            onUpdated={handleGuestUpdated}
          />
        )}
      </div>
    );
  }

  // ----------- 🚫 No User Logged In -------------
  return (
    <div className="user-details-container">
      <div className="auth-modal">
        <h2>Access Denied 🚫</h2>
        <p>Please sign in or sign up to continue.</p>
        <div className="auth-buttons">
          <button onClick={() => navigate('/signin')}>Sign In</button>
          <button onClick={() => navigate('/sign-up')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
