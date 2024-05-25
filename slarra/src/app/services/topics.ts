import { useQuery, useMutation, useQueryClient } from 'react-query';
import axiosConfig from '../lib/axios.config';

export const useFetchTopicsQuery = () => {
  return useQuery('topics', async () => {
    const res = await axiosConfig.get('/topics/all');
    return res.data;
  });
}

export const useCreateTopicMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newTopicData: any) => axiosConfig.post('/topics/new', newTopicData), // Send POST request to create topic
    {
      onSuccess: () => {
        queryClient.invalidateQueries('topics'); // Invalidate topics query after mutation
      },
      onError: (error: any) => {
        console.error('Create topic error:', error.message);
      }
    }
  );
}

export const useTopicsByGame = (gameId: string) => {
  return useQuery(['topics', gameId], async () => {
    const res = await axiosConfig.get(`/games/${gameId}/topics/all`);
    return res.data;
  });
}

export const useTopicById = (topicId: string) => {
  return useQuery(['topic', topicId], async () => {
    const res = await axiosConfig.get(`/topics/${topicId}`);
    return res.data;
  });
}

export const useUpdateTopicMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (updatedTopicData: any) => axiosConfig.put(`/topics/${updatedTopicData.id}`, updatedTopicData), // Send PUT request to update topic
    {
      onSuccess: () => {
        queryClient.invalidateQueries('topics'); // Invalidate topics query after mutation
      },
      onError: (error: any) => {
        console.error('Update topic error:', error.message);
      }
    }
  );
}