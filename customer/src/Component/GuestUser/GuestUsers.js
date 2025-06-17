import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGuestUser } from './Service';
import './Style.css';

const CreateGuestUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    street_line: '',
    plot_number: '',
    city: '',
    state: '',
    zip_code: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const {
      name,
      phone_number,
      email,
      street_line,
      plot_number,
      city,
      state,
      zip_code,
    } = formData;

    if (
      !name || !phone_number || !email || !street_line ||
      !plot_number || !city || !state || !zip_code
    ) {
      setError('❗ All fields are required.');
      setLoading(false);
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      setError('❗ Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.');
      setLoading(false);
      return;
    }

    try {
      const guestUser = await createGuestUser(formData);
      if (guestUser && guestUser.id) {
        const guestUserId = guestUser.id;
        localStorage.setItem('guest_user_id', guestUserId);

        const tempCartId = localStorage.getItem('temp_cart_id');

        if (tempCartId) {
          const response = await fetch('http://localhost:8000/cart/cart/cart/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              temp_cart_id: tempCartId,
              guest_user_id: guestUserId,
              customer_id: null,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to merge cart');
          }
        }

        navigate('/cart');
      } else {
        setError('❗ Guest user created, but no ID returned.');
      }
    } catch (err) {
      setError('❗ Failed to create guest user or merge cart.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-user-form">
      <h2>Create Guest User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="street_line"
          value={formData.street_line}
          onChange={handleChange}
          placeholder="Street Line"
          required
        />
        <input
          type="text"
          name="plot_number"
          value={formData.plot_number}
          onChange={handleChange}
          placeholder="Plot Number"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        <input
          type="text"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange}
          placeholder="Zip Code"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Guest User'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateGuestUser;
