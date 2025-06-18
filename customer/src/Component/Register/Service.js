import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

export const sendOtp = async ({ email }) => {
  const payload = { email };


  const response = await axios.post(
    `${BASE_URL}/api/customer/auth/otp/auth/request-otp`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
