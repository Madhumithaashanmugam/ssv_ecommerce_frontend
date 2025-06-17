import axios from 'axios';

export const registerUser = async (data) => {
  try {
    // Log the request data for debugging purposes
    console.log("Sending registration data:", data);
    
    // Register the user and capture the response
    const response = await axios.post('http://127.0.0.1:8000/api/customer/auth/otp/auth/register', data);

    // Log the entire response to verify it
    console.log("Registration response:", response);

    // Extract the token and user data from the response
    const { access_token, user } = response.data;
    
    // Check if the access_token exists
    if (access_token) {
      console.log("Access token received:", access_token);
      
      // Store the token in localStorage (or sessionStorage if preferred)
      localStorage.setItem('access_token', access_token);
      
      // Log the stored token for verification
      console.log("Access token stored:", localStorage.getItem('access_token'));
      
      // Log user data for debugging
      console.log("User data:", user);
      
      // Alert user of successful registration
      alert('Registration successful!');
      
    } else {
      // Log the response if no token is received
      console.log("No token received in response.");
      alert('Registration failed. No token received.');
    }
    
  } catch (error) {
    // Log the entire error object for debugging purposes
    console.error("Registration error:", error);

    // Check if there's a response from the server
    if (error.response) {
      // Handle known errors based on the response data
      if (error.response.data && error.response.data.detail) {
        if (error.response.data.detail === "User already registered.") {
          alert('This user is already registered. Please try logging in or use a different email/phone number.');
        } else {
          alert('An error occurred during registration: ' + error.response.data.detail);
        }
      } else {
        alert('An error occurred during registration.');
      }
    } else {
      // If no response, maybe a network error occurred
      alert('An unexpected error occurred. Please check your internet connection.');
    }
  }
};
