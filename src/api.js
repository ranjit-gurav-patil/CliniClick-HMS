import axios from 'axios';

// 1. Create the base instance using your hidden Environment Variable!
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420'
  }
});

// 2. The JWT Interceptor: Automatically attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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