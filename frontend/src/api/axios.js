import axios from 'axios';

// Fallback to localhost if the environment variable isn't set
const baseURL = import.meta.env.VITE_API_URL 
  ? `https://${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: baseURL,
});

// Attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;