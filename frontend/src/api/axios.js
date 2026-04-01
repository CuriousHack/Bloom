import axios from 'axios';

// 1. Get the raw host from the environment
const rawHost = import.meta.env.VITE_API_URL;

// 2. Build the full URL properly
const baseURL = rawHost 
  ? (rawHost.includes('onrender.com') 
      ? `https://${rawHost}/api` 
      : `https://${rawHost}.onrender.com/api`) // Force the suffix if missing
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