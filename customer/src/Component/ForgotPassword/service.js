// components/ForgotPassword/Service.js

const BASE_URL = 'http://localhost:8000/api/customer/auth/otp/auth';
const REQUEST_OTP_URL = `${BASE_URL}/request-reset-otp`;
const VERIFY_OTP_URL = `${BASE_URL}/verify-reset-otp`;

/**
 * Sends a reset OTP to the given email.
 */
export const sendResetOtp = async (email) => {
  const response = await fetch(REQUEST_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }), // ✅ send as { email: "value" }
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP');
  }

  return await response.json();
};

/**
 * Verifies the OTP for the given email.
 */
export const verifyResetOtp = async (email, otp) => {
  const response = await fetch(VERIFY_OTP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }), // ✅ send as { email, otp }
  });

  if (!response.ok) {
    throw new Error('Invalid OTP');
  }

  return await response.json();
};

/**
 * Resets the password using email, otp, and new password.
 */
export const resetPassword = async (data) => {
  const response = await fetch('http://localhost:8000/api/customer/auth/otp/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Reset password failed');
  }

  return response.json();
};

