import axios from 'axios';

const API_URL = 'http://localhost:5001/api/payment';

export const initiatePayment = async (user_id, amount, paymentMethod) => {
  try {
    const response = await axios.post(`${API_URL}/add`, {
      user_id,
      amount,
      payment_method: paymentMethod
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add payment' };
  }
};

export const checkPaymentStatus = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/status/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to check payment status' };
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch payment history' };
  }
}; 