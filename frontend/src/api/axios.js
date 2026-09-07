import axios from 'axios';

// Get URL and normalize it so it always ends with "/api" and avoids double slashes
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
const normalizedUrl = rawUrl.replace(/\/+$/, '');
const baseURL = normalizedUrl.endsWith('/api')
  ? normalizedUrl
  : `${normalizedUrl}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;