// utils/sinchSandbox.js
import axios from 'axios';

const SINCH_API_KEY = process.env.SINCH_API_KEY;
const SINCH_API_SECRET = process.env.SINCH_API_SECRET;

export const sendTestSMS = async (to, message) => {
  try {
    // Sinch sandbox only works with verified numbers
    const response = await axios.post(
      'https://sandbox.api.sinch.com/messaging/v1/messages',
      {
        from: 'FacilityBook',
        to: [to],
        body: message
      },
      {
        auth: {
          username: SINCH_API_KEY,
          password: SINCH_API_SECRET
        }
      }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};