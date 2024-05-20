// lib/axios.config.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8001', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the Authorization header
axiosConfig.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Assuming you're storing your token in cookies
    if (token && config.url !== '/login') { // Exclude the login route
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);}
  );

export default axiosConfig;
