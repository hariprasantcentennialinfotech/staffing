import axios from 'axios';

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocal
    ? 'http://localhost:5000/api'
    : 'https://ci-indeed-jp-new.onrender.com/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;