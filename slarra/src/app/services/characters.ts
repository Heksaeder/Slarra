import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosConfig from '../lib/axios.config';

export const useFetchCharactersQuery = () => {
  return useQuery('characters', async () => {
    const res = await axiosConfig.get('/characters/all');
    return res.data;
  });
}

export const useCreateCharacterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newCharData: any) => axiosConfig.post('/characters/new', newCharData), // Send POST request to create character
    {
      onSuccess: () => {
        queryClient.invalidateQueries('characters'); // Invalidate characters query after mutation
      },
      onError: (error: any) => {
        console.error('Create character error:', error.message);
      }
    }
  );
}

export const useCharactersByGame = (gameId: string) => {
  return useQuery(['characters', gameId], async () => {
    const res = await axiosConfig.get(`/games/${gameId}/all`);
    return res.data;
  });
}

export const useCharacter = (charId: string) => {
  return useQuery(['character', charId], async () => {
    const res = await axiosConfig.get(`/characters/${charId}`);
    return res.data;
  });
}

export const useUpdateCharacterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (updatedCharData: any) => axiosConfig.put(`/characters/${updatedCharData._id}`, updatedCharData), // Send PUT request to update character
    {
      onSuccess: () => {
        queryClient.invalidateQueries('characters'); // Invalidate characters query after mutation
      },
      onError: (error: any) => {
        console.error('Update character error:', error.message);
      }
    }
  );
  } 
