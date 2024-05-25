import {useQuery, useMutation, useQueryClient} from 'react-query';
import axiosConfig from '../lib/axios.config';

export const useFetchMessagesQuery = () => {
  return useQuery('messages', async () => {
    const res = await axiosConfig.get('/posts/all');
    return res.data;
  });
}

export const useCreateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newMessageData: any) => axiosConfig.post('/posts/new', newMessageData), // Send POST request to create message
    {
      onSuccess: () => {
        console.log('Message created successfully');
        queryClient.invalidateQueries('messages'); // Invalidate messages query after mutation
      },
      onError: (error: any) => {
        console.error('Create message error:', error.message);
      }
    }
  );
}

export const useMessagesByTopic = (topicId: string, page: number, pageSize: number) => {
  return useQuery(['messages', topicId, page, pageSize], async () => {
    console.log('topicId mutation:', topicId)
    const res = await axiosConfig.get('/topics/${topicId}/posts/all', {
      params: {
        topicId,
        page,
        pageSize
      }});
    return res.data;
  },
  {
    enabled: !!topicId
  });
}

export const useUpdateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (updatedMessageData: any) => axiosConfig.put(`/posts/${updatedMessageData.id}`, updatedMessageData), // Send PUT request to update message
    {
      onSuccess: () => {
        console.log('Message updated successfully');
        queryClient.invalidateQueries('messages'); // Invalidate messages query after mutation
      },
      onError: (error: any) => {
        console.error('Update message error:', error.message);
      }
    }
  );
}

export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (messageId: string) => axiosConfig.delete(`/posts/${messageId}`), // Send DELETE request to delete message
    {
      onSuccess: () => {
        console.log('Message deleted successfully');
        queryClient.invalidateQueries('messages'); // Invalidate messages query after mutation
      },
      onError: (error: any) => {
        console.error('Delete message error:', error.message);
      }
    }
  );
}