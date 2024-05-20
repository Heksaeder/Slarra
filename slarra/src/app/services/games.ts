import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosConfig from '../lib/axios.config';

export const useFetchGamesQuery = () => {
  return useQuery('games', async () => {
    const res = await axiosConfig.get('/games/all');
    return res.data;
  });
}

export const useFetchGameQuery = (gameId: string) => {
  return useQuery(['game', gameId], async () => {
    const res = await axiosConfig.get(`/games/${gameId}`);
    return res.data;
  });
}

export const useAddGameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((newGame: { title: string; image: string; description: string }) => axiosConfig.post('/games/new', newGame),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('games');
      }
    });
}

// Update game
export const useUpdateGameMutation = () => {
  return useMutation(
    (data: any) => axiosConfig.put(`/games/${data._id}`, data),
    {
      onSuccess: (data: any) => {
        console.log('Update game success:', data);
      },
      onError: (error: any) => {
        console.error('Update game error:', error.message);
      }
    }
  );
};

export const useDeleteGameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((gameId: string) => axiosConfig.delete(`/games/${gameId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('games');
      }
    });
}

