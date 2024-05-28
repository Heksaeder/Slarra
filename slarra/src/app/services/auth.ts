// services/auth.ts
import axiosConfig from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const login = async (loginData: any) => {
  const response = await axiosConfig.post('/users/login', loginData);
  const { token } = response.data;

  Cookies.set('token', token, { 
    expiresIn: '1h', // Token expires in 1 hour
    secure: true, 
    sameSite: 'strict',
    httpOnly: true
  });
  
  return response.data;
};

export const getUserIdFromToken = () => {
  const token = Cookies.get('token');

  if (token) {
    const decodedToken: { id: string } = jwtDecode(token);
    return decodedToken.id;
  }

  return null;
}

export const getUserRole = () => {
  const token = Cookies.get('token');

  if (token) {
    const decodedToken: { role: string } = jwtDecode(token);
    return decodedToken.role;
  }

  return null;
}



export default axiosConfig;

