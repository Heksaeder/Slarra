'use client'
import React, { useEffect, useState } from 'react'
import { useTopicById, useUpdateTopicMutation } from '@/app/services/topics'
import { useCreateMessageMutation, useMessagesByTopic, useUpdateMessageMutation, useDeleteMessageMutation } from '@/app/services/messages'
import { useCharacter, useCharactersByGame } from '@/app/services/characters' // Adjust the import path
import { useFetchUserQuery } from '@/app/services/users'

import { sanitizeInput } from '@/app/lib/purify'

import he from 'he'
import Modal from 'react-modal'

const TopicDetails = () => {
  const [topicId, setTopicId] = useState('')
  const [gameId, setGameId] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditTopicModal, setIsEditTopicModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of messages per page

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const topicId = window.location.pathname.split('/')[4];
      setTopicId(topicId)
      const gameId = window.location.pathname.split('/')[2];
      setGameId(gameId)
    }
  }, [])

  const { data: topic, isLoading: topicLoading, isError: topicError } = useTopicById(topicId);
  const { data: messages, isLoading: messagesLoading, isError: messagesError } = useMessagesByTopic(topicId, currentPage, pageSize);
  const { data: characters, isLoading: charactersLoading, isError: charactersError } = useCharactersByGame(gameId);
  
  const updateTopicMutation = useUpdateTopicMutation();
  
  const handleEditTopic = async (updatedTopicData: { id: string, title: string, body: string, userId:string, gameId:string }) => {
    try {
      console.log('Updating topic data:', updatedTopicData);
      await updateTopicMutation.mutateAsync(updatedTopicData);
      console.log('Topic data updated successfully');
    } catch (error: any) {
      console.error('Error updating topic data:', error.message);
    }
  };

  // Pagination functions
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  if (topicLoading) return '';
  if (topicError) return '';
  if (messagesLoading) return '';
  if (messagesError) return '';
  if (charactersLoading) return '';
  if (charactersError) return '';

  return (
    <div>
      {topic && (
        <div className='flex flex-col h-screen w-[90vw] place-center m-auto'>
          <h1 className='pb-0 mb-0 bg-transparent'>{topic.title}</h1>
          <p className='bg-transparent text-sm italic'>{topic.body}</p>
            
            {/* Edit topic modal */}
            <button onClick={() => setIsEditTopicModal(true)}>Edit Topic</button>
            <Modal
              isOpen={isEditTopicModal}
              onRequestClose={() => setIsEditTopicModal(false)}
              overlayClassName={'overlay-modal'}
              contentLabel="Edit Topic"
              className="modal"
            >
              <EditTopic topicData={topic} onSubmit={handleEditTopic} onClose={() => setIsEditTopicModal(false)} />
            </Modal>
          {messages.map((message: any) => (
            <MessageWithCharacter key={message._id} message={message} />
          ))}

          {/* Pagination controls */}
          <div>
            <button onClick={prevPage}>Previous</button>
            <span>Page {currentPage}</span>
            <button onClick={nextPage}>Next</button>
          </div>

          {/* Post new message modal */}
          <button onClick={() => setIsOpenModal(true)}>Post New Message</button>
          <Modal
            isOpen={isOpenModal}
            onRequestClose={() => setIsOpenModal(false)}
            overlayClassName={'overlay-modal'}
            contentLabel="Post New Message"
            className="modal"
          >
            <PostNewMessage topicId={topicId} characters={characters} onClose={() => setIsOpenModal(false)} />
          </Modal>

        </div>
      )}
    </div>
  )
}

const MessageWithCharacter = ({ message }: { message: any }) => {
  const { data: character, isLoading: characterLoading, isError: characterError } = useCharacter(message.characterId);
  const { data: author, isLoading: authorLoading, isError: authorError } = useFetchUserQuery(message.userId);

  const updatePostMutation = useUpdateMessageMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const handleUpdatePost = async (updatedContent: string) => {
    const updatedMessage = { id: message._id, content: updatedContent, topicId: message.topicId, userId: message.userId, characterId: message.characterId }; // Create an object with content and topicId
    console.log('Updating post:', updatedMessage);

    try {
      updatePostMutation.mutateAsync({ ...updatedMessage });
    } catch (error: any) {
      console.error('Error updating post:', error.message);
    }
  };

  const decodedContent = he.decode(message.content)

  if (characterLoading) return '';
  if (characterError) return '';
  if (authorLoading) return '';
  if (authorError) return '';



  return (
    <div className='flex flex-row p-2'>
      {character && (
        <div className='profile-body'>
          <div className='zoomed-avatar w-[200px] h-[200px] bg-cover rounded-full flex flex-col items-center justify-center shadow-lg shadow-neutral-950' style={{ backgroundImage: `url(${character.image})` }}>
            <h6 className='text-sm font-bold' style={{ textShadow: '1px 1px 1px black' }}>{author.name} as</h6>
            <h3 className='text-xl font-extrabold uppercase text-center' style={{ textShadow: '2px 2px 2px black' }}>{character.name}</h3>
          </div>
        </div>
      )}
      <div className='message-body flex flex-col w-full m-4 p-4 bg-[#080808] rounded-sm shadow-black shadow-md'>
        <p className='bg-transparent h-full text-[12px] text-justify' dangerouslySetInnerHTML={{ __html: decodedContent }}></p>
        <div className='w-full text-right text-[9px] text-white'><button onClick={() => setIsOpenModal(true)}>
          edit
        </button>
          <button onClick={() => setIsDeleteModal(true)}>
          delete
        </button> | {message.createdAt.substring(0, 10)}</div>
        
        <Modal
          isOpen={isOpenModal}
          onRequestClose={() => setIsOpenModal(false)}
          overlayClassName={'overlay-modal'}
          contentLabel="Edit Message"
          className="modal"
        >
          <EditMessage postData={decodedContent} onSubmit={handleUpdatePost} onClose={() => setIsOpenModal(false)} />
        </Modal>

        {/* Delete message modal */}
        <Modal 
          isOpen={isDeleteModal}
          onRequestClose={() => setIsDeleteModal(false)}
          overlayClassName={'overlay-modal'}
          contentLabel="Delete Message"
          className="modal"
        >
          <DeleteMessage message={message} onClose={() => setIsDeleteModal(false)} />
        </Modal>
      </div>
    </div>
  );
};

const EditMessage = ({ postData, onSubmit, onClose }: { postData: string, onSubmit: (updatedContent: string) => void, onClose: () => void }) => {
  const [updatedContent, setUpdatedContent] = useState(postData);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedContent(sanitizeInput(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting updated message data:', updatedContent);
    onSubmit(updatedContent);
    onClose();
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={updatedContent}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const EditTopic = ({ topicData, onSubmit, onClose }: { topicData: any, onSubmit: (updatedTopicData: { id: string, title: string, body: string, userId:string, gameId: string }) => void, onClose: () => void }) => {
  const [title, setTitle] = useState(topicData.title);
  const [body, setBody] = useState(topicData.body);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedBody = sanitizeInput(body);
    const updatedTopicData = { id: topicData._id, title: sanitizedTitle, body: sanitizedBody, userId: topicData.userId, gameId: topicData.gameId};
    console.log('Submitting updated topic data:', updatedTopicData);
    onSubmit(updatedTopicData);
    onClose();
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

const PostNewMessage = ({ topicId, characters, onClose }: { topicId: string, characters: any, onClose: () => void }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [characterId, setCharacterId] = useState('');
  const createPost = useCreateMessageMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting new message data:', content);
    const sanitizedContent = sanitizeInput(content);
    const newMessage = { content: sanitizedContent, topicId, characterId: characterId };
    console.log('New message:', newMessage);
    try {
      await createPost.mutateAsync(newMessage);
      console.log('Message posted successfully');
      onClose();
    } catch (error: any) {
      console.error('Error posting message:', error.message);
    }
  };

  const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCharacterId = e.target.value;
    console.log('Selected character ID:', selectedCharacterId); // Debugging log
    setCharacterId(selectedCharacterId);
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="character">Character:</label>
        <select
          id="character"
          name="character"
          value={characterId}
          onChange={handleCharacterChange}
        >
          <option value="">Select a character</option>
          {characters.map((char: any) => (
            <option key={char._id} value={char._id}>
              {char.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

const DeleteMessage = ({ message, onClose }: { message: any, onClose: () => void }) => {
  const deletePostMutation = useDeleteMessageMutation();
  const messageId = message._id;
  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(messageId);
      console.log('Message deleted successfully');
      onClose();
    } catch (error: any) {
      console.error('Error deleting message:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handleDeletePost}>Delete</button>
    </div>
  );
}

export default TopicDetails;