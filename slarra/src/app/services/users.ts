import { useQuery, useMutation } from 'react-query';
import axiosConfig from '../lib/axios.config';
import Cookies from 'js-cookie';

const fetchUsers = async () => {
  const res = await axiosConfig.get('/users');
  return res.data;
}

/* LOGIN */
export const useLoginMutation = () => {
  return useMutation(
    (loginData: any) => axiosConfig.post('/users/login', loginData),
    {
      onSuccess: (data: any) => {
        // Extract token from response
        const token = data.data.token;
        // Store token in local storage
        Cookies.set('token', token);
        console.log('Login success:', data.data.token)
      },
      onError: (error: any) => {
        console.error('Login error:', error.message)
      }
    }
  )
}

/* REGISTER */
export const useRegisterMutation = () => {
  return useMutation(
    (userData: any) => axiosConfig.post('/users/new', userData),
    {
      onError: (error: any) => {
        console.error('Create user error:', error.message)
      }
    }
  )
}

export const useFetchUserQuery = (userId: string) => {
  return useQuery(['user', userId], async () => {
    const response = await axiosConfig.get(`/users/${userId}`);
    const userData = response.data;
    const newData = {...userData, id: userData._id};
    return newData;
  });
};

export const useUpdateMutation = () => {
  return useMutation(
    (userData: {id: string; name: string; email:string; bio:string}) => axiosConfig.put(`/users/${userData.id}`, userData),
    {
      onSuccess: (data: any) => {
        console.log('Update user success:', data)
      },
      onError: (error: any) => {
        console.error('Update user error:', error.message)
      }
    }
  )
}

export const useDeleteMutation = () => {
  return useMutation(
    (userId: string) => axiosConfig.delete(`/users/${userId}`),
    {
      onSuccess: (data: any) => {
        console.log('Delete user success:', data)
      },
      onError: (error: any) => {
        console.error('Delete user error:', error.message)
      }
    }
  )
}
