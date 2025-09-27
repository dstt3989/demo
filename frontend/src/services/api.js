import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchItems = async () => {
  const res = await axios.get(`${API_URL}/items`);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/users/register`, userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/users/login`, credentials);
  return res.data;
};

