// services/auth.ts
import axiosConfig from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const login = async (loginData: any) => {
  const response = await axiosConfig.post('/users/login', loginData);
  const { token } = response.data;
  // Set the token in an HTTP-only cookie
  Cookies.set('token', token, { 
    expiresIn: '30m', // Token expires in 15 minutes
    secure: true, 
    sameSite: 'Strict' 
  });
  return response.data;
};

export const getUserIdFromToken = () => {
  const token = Cookies.get('token');

  if (token) {
    const decodedToken: { id: string } = jwtDecode(token);
    return decodedToken.id;
  }

  return null; // Token not found or invalid
};


export default axiosConfig;

