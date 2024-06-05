// lib/axios.config.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const getToken = () => {
  const token = Cookies.get('token');
  return token ? `Bearer ${token}` : null;
};

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:8001',
    common: {
      'Authorization': `Bearer ${getToken()}`
    }
  },
});


axiosConfig.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.url !== '/login') { 
      config.headers['Authorization'] = token;
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
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.location.href = '/login'; 
    }
    return Promise.reject(error);}
  );

export default axiosConfig;
