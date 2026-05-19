import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.debug('[API] Request:', config.method?.toUpperCase(), config.url, config.data, config.headers);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.debug('[API] Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.debug('[API] Response error:', error?.response?.status, error?.config?.url, error?.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
