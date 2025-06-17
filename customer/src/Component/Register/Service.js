import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const sendOtp = async ({ email }) => {
  const payload = { email };

  console.log('📦 Sending OTP request payload:', payload); // ✅ Log the payload

  const response = await axios.post(
    `${BASE_URL}/api/customer/auth/otp/auth/request-otp`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('✅ OTP request successful:', response.data); // Optional: log backend response
  return response.data;
};
