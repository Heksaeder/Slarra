// services/auth.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8000', // Change this to your server's URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (loginData: any) => {
  const response = await axiosConfig.post('/users/login', loginData);
  const { token } = response.data;
  // Set the token in an HTTP-only cookie
  Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
  return response.data;
};

export const logout = async () => {
  Cookies.remove('token');
  return;
}

export const getUserIdFromToken = () => {
  const token = Cookies.get('token');

  if (token) {
    const decodedToken: { id: string } = jwtDecode(token);
    return decodedToken.id;
  }

  return null; // Token not found or invalid
};


export default axiosConfig;

