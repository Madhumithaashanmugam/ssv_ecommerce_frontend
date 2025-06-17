import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createAddress,
  updateAddress,
  fetchAddressByCustomerId,
} from './Service';
import { AuthContext } from '../Context/AuthContext';
import './AddressForm.css';

const AddressForm = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addressId } = useParams();
  const isUpdate = Boolean(addressId);

  const [formData, setFormData] = useState({
    address_line: '',
    city: '',
    state: '',
    zip_code: '',
    extra_details: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        setLoading(true);
        const allAddresses = await fetchAddressByCustomerId(userInfo.id || userInfo.user_id);
        const selectedAddress = allAddresses.find((addr) => addr.id === addressId);
        if (selectedAddress) {
          setFormData(selectedAddress);
        }
      } finally {
        setLoading(false);
      }
    };

    if (isUpdate) {
      loadAddress();
    }
  }, [addressId, userInfo, isUpdate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (isUpdate) {
        await updateAddress(addressId, formData);
      } else {
        const payload = {
          ...formData,
          customer_id: userInfo.id || userInfo.user_id,
        };
        await createAddress(payload);
      }
      navigate('/user-details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-container">
      <h2>{isUpdate ? 'Update Address' : 'Add New Address'}</h2>
      <form onSubmit={handleSubmit} className="address-form">
        <input
          type="text"
          name="address_line"
          placeholder="Address Line"
          value={formData.address_line}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="zip_code"
          placeholder="Zip Code"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="extra_details"
          placeholder="Extra Details (Optional)"
          value={formData.extra_details}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isUpdate ? 'Update Address' : 'Add Address'}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
