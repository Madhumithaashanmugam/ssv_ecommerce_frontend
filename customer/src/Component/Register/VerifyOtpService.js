// verifyOtpService.js
import axios from 'axios';

export const verifyOtp = async (data) => {
  const response = await axios.post('http://127.0.0.1:8000/api/customer/auth/otp/auth/verify-otp', data);
  return response.data;
};
