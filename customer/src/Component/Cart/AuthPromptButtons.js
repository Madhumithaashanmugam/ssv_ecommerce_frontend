import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { fetchGuestDetailsById } from '../GuestUser/Service';

const AuthPromptButtons = () => {
  const navigate = useNavigate();
  const { userInfo, authReady } = useContext(AuthContext);
  const [isValidGuest, setIsValidGuest] = useState(null); // null = not checked yet

  useEffect(() => {
    if (!authReady) return;

    const guestUserId = localStorage.getItem('guest_user_id');

    if (guestUserId) {
      // Verify guestUserId via API
      fetchGuestDetailsById(guestUserId)
        .then(() => {
          // guestUserId is valid
          setIsValidGuest(true);
        })
        .catch(() => {
          // guestUserId invalid, remove it
          localStorage.removeItem('guest_user_id');
          setIsValidGuest(false);
        });
    } else {
      setIsValidGuest(false); // no guest user id in storage
    }
  }, [authReady]);

  if (!authReady || isValidGuest === null) {
    return null; // waiting for auth and guest validation
  }

  const hasCustomer = Boolean(userInfo?.id);
  const hasGuest = Boolean(isValidGuest);

  if (hasCustomer || hasGuest) {
    return null;
  }


  return (
    <div className="auth-buttons">
      <button className="auth-button" onClick={() => navigate('/signin')}>
        Sign In
      </button>
      <button className="auth-button" onClick={() => navigate('/signup-register')}>
        Sign Up
      </button>
      <button className="auth-button" onClick={() => navigate('/guest-user')}>
        Guest User
      </button>
    </div>
  );
};

export default AuthPromptButtons;
