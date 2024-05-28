import { useQuery, useMutation } from 'react-query';
import axiosConfig from '../lib/axios.config';
import Cookies from 'js-cookie';

// Fetch all users
export const useFetchUsers = () => {
  return useQuery('users', async () => {
    const response = await axiosConfig.get('/users/all');
    return response.data;
  });
}

// Login mutation
export const useLoginMutation = () => {
  return useMutation(
    async (loginData) => {
      const response = await axiosConfig.post('/users/login', loginData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const token = data.token;
        Cookies.set('token', token);
        console.log('Login success:', token);
      },
      onError: (error:Error) => {
        console.error('Login error:', error.message);
      }
    }
  );
}

// Register mutation
export const useRegisterMutation = () => {
  return useMutation(
    async (userData) => {
      const response = await axiosConfig.post('/users/new', userData);
      return response.data;
    },
    {
      onError: (error:Error) => {
        console.error('Create user error:', error.message);
      }
    }
  );
}

// Fetch user by ID
export const useFetchUserQuery = (userId:string) => {
  return useQuery(['user', userId], async () => {
    console.log('Fetching user:', userId);
    const response = await axiosConfig.get(`/users/${userId}`);
    console.log('User data:', response.data)
    return response.data;
  }, {
    enabled: !!userId, // Only run query if userId is provided
    onError: (error:Error) => {
      console.error('Fetch user error:', error.message);
    },
  });
};

// Update user mutation
export const useUpdateMutation = () => {
  return useMutation(
    async (userData: {id: string; name: string; email:string; bio:string}) => {
      if (!userData.id) {
        throw new Error('User ID is missing');
      }
      const response = await axiosConfig.put(`/users/${userData.id}`, userData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log('Update user success:', data);
      },
      onError: (error:Error) => {
        console.error('Update user error:', error.message);
      }
    }
  );
}

// Delete user mutation
export const useDeleteMutation = () => {
  return useMutation(
    async (userId) => {
      const response = await axiosConfig.delete(`/users/${userId}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        console.log('Delete user success:', data);
      },
      onError: (error:Error) => {
        console.error('Delete user error:', error.message);
      }
    }
  );
}

// Logout mutation
export const useLogoutMutation = () => {
  return useMutation(
    async () => {
      const response = await axiosConfig.post('/users/logout');
      return response.data;
    },
    {
      onSuccess: (data) => {
        Cookies.remove('token');
        console.log('Logout success:', data);
      },
      onError: (error:Error) => {
        console.error('Logout error:', error.message);
      }
    }
  );
}
