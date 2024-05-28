'use client'
import React, { useEffect, useState } from 'react'
import { useTopicById, useUpdateTopicMutation } from '@/app/services/topics'
import { useCreateMessageMutation, useMessagesByTopic, useUpdateMessageMutation, useDeleteMessageMutation } from '@/app/services/messages'
import { useCharacter, useCharactersByGame } from '@/app/services/characters' // Adjust the import path
import { useFetchUserQuery } from '@/app/services/users'
import { getUserRole, getUserIdFromToken } from '@/app/services/auth'

import { sanitizeInput } from '@/app/lib/purify'

import he from 'he'
import Modal from 'react-modal'
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowUp, IoIosBrush, IoIosClose } from 'react-icons/io'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const TopicDetails = () => {

  const userId = getUserIdFromToken();
  const userRole = getUserRole();
  
  const [topicId, setTopicId] = useState('')
  const [gameId, setGameId] = useState('')

  
  const [isListVisible, setIsListVisible] = useState(true);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditTopicModal, setIsEditTopicModal] = useState(false);
  const [isBodyDisplayed, setIsBodyDisplayed] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const topicId = window.location.pathname.split('/')[4];
      setTopicId(topicId)
      const gameId = window.location.pathname.split('/')[2];
      setGameId(gameId)
    }
  }, [])

  const { data: topic, isLoading: topicLoading, isError: topicError } = useTopicById(topicId);
  const { data: messages, isLoading: messagesLoading, isError: messagesError } = useMessagesByTopic(topicId);
  const { data: characters, isLoading: charactersLoading, isError: charactersError } = useCharactersByGame(gameId);

  const updateTopicMutation = useUpdateTopicMutation();

  const handleEditTopic = async (updatedTopicData: { id: string, title: string, body: string, userId: string, gameId: string }) => {
    try {
      await updateTopicMutation.mutateAsync(updatedTopicData);
    } catch (error: any) {
    }
  };

  if (topicLoading || messagesLoading || charactersLoading) return '<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="loading" />'; // Show loading state
  if (topicError) return '';
  if (messagesError) return '';
  if (charactersError) return '';


  // Calculate total pages
  const totalPages = Math.ceil(messages.length / postsPerPage);

  // Get topics for current page
  const currentPosts = messages.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const goToTop = () => {
    const duration = 1000; // Duration in milliseconds
    const start = window.scrollY;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const scroll = () => {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      const timeFunction = easeInOutQuad(time);

      window.scrollTo(0, Math.ceil(timeFunction * (0 - start) + start));

      if (window.scrollY === 0) {
        return;
      }

      requestAnimationFrame(scroll);
    };

    scroll();
  };

  // Pagination functions
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      goToTop();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      goToTop();
    }
  };


  const toggleListVisibility = () => {
    setTimeout(() => {
      setIsListVisible(!isListVisible);
    }, 100);
  };

  const decodedBody = he.decode(topic.body)

  return (
    <div>
      {topic && (
        <div className='flex flex-col h-full w-screen lg:w-full'>
          {(userRole == 'admin' || userId === topic.userId) && (
          <button className="text-2xl fixed right-0 top-0 m-6 z-20" onClick={() => setIsEditTopicModal(true)}><IoIosBrush /></button>
          )}
          <h1 onClick={toggleListVisibility} className='cursor-pointer bg-[#080808] p-4 fixed w-screen z-10' style={{ boxShadow: '0px 5px 5px #101010' }}>{topic.title} </h1>
          <div
          className={`${isListVisible ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'
            } transition-all duration-500 ease-in-out overflow-hidde flex flex-row justify-center`}
        ><p className='topic-desc' dangerouslySetInnerHTML={{__html:decodedBody}}></p></div>

          {/* Edit topic modal */}
          <Modal
            isOpen={isEditTopicModal}
            onRequestClose={() => setIsEditTopicModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Edit Topic"
            className="p-4 md:modal"
          >
            <EditTopic topicData={topic} onSubmit={handleEditTopic} onClose={() => setIsEditTopicModal(false)} />
          </Modal>
          <div className='flex flex-row justify-center'>
            <div className='my-16 lg:w-[90dvw] xl:w-[80dvw]'>
            {currentPosts.map((message: any) => (
              <MessageWithCharacter key={message._id} message={message} />
            ))}
          </div>
          </div>

          <div id="PAGINATION" className="fixed z-20 bottom-0 w-full flex justify-between items-center p-4 bg-[#080808]"> {/* Adjusted to be fixed */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className=" text-white rounded disabled:opacity-0"
            >
              <IoIosArrowBack />
            </button>{/*<span className="text-white">
            Page {currentPage} of {totalPages}
        </span>*/}
            <button className='go-to-top' onClick={goToTop}>
              <IoIosArrowUp />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className=" text-white rounded disabled:opacity-0"
            >
              <IoIosArrowForward />
            </button>
            {/* Post new message modal */}
            {(messages.length > 0)
              ? <button className='post-btn absolute inset-x-0 bottom-0 mb-10 m-2' onClick={() => setIsOpenModal(true)}>new post</button>
              : <div className='flex flex-col h-screen justify-center items-center'><button className='first-post-btn text-4xl' onClick={() => setIsOpenModal(true)}>first!</button>
                <p className='h-1/4 italic text-sm pt-4'>Be a winner, post first</p></div>
            }
          </div>



          <Modal
            isOpen={isOpenModal}
            onRequestClose={() => setIsOpenModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Post New Message"
            className="p-4 md:modal"
          >
            <PostNewMessage topicId={topicId} characters={characters} onClose={() => setIsOpenModal(false)} />
          </Modal>

        </div>
      )}
    </div>
  )
}

const MessageWithCharacter = ({ message }: { message: any }) => {
  const userId = getUserIdFromToken();
  const userRole = getUserRole();
  const { data: character, isLoading: characterLoading, isError: characterError } = useCharacter(message.characterId);
  const { data: author, isLoading: authorLoading, isError: authorError } = useFetchUserQuery(message.userId);

  const updatePostMutation = useUpdateMessageMutation();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const handleUpdatePost = async (updatedContent: string) => {
    const updatedMessage = { id: message._id, content: updatedContent, topicId: message.topicId, userId: message.userId, characterId: message.characterId }; // Create an object with content and topicId

    try {
      updatePostMutation.mutateAsync({ ...updatedMessage });
    } catch (error: any) {
    }
  };

  const decodedContent = he.decode(message.content)

  if (characterLoading) return '';
  if (characterError) return '';
  if (authorLoading) return '';
  if (authorError) return '';

  const date = message.createdAt.substring(0, 10)
  const day = date.substring(8, 10)
  const month = date.substring(5, 7)
  const year = date.substring(0, 4)

  return (
    <div className='flex flex-col lg:flex-row md:w-screen lg:w-full border-b-2 py-4 border-neutral-900'> {/*Full message */}
      <div className='profile-body lg:m-6'>
        <div className='zoomed-avatar lg:w-[200px] lg:h-[200px] bg-cover bg-center rounded-full flex flex-row lg:flex-col items-center justify-center shadow-lg shadow-neutral-950' style={{ backgroundImage: `url(${character.image})` }}>
          <h4 className='text-sm font-bold' style={{ textShadow: '1px 1px 1px black' }}>{author.name} as</h4>
          <h3 className='text-xl font-extrabold uppercase text-center' style={{ textShadow: '2px 2px 2px black' }}>{character.name}</h3>
        </div>
      </div>
      <div className='message-body flex flex-col w-full my-4 p-4 lg:p-6 bg-[#080808] rounded-sm shadow-black shadow-md'>

        <p className='bg-transparent h-full text-[16px] text-justify mb-4' dangerouslySetInnerHTML={{ __html: decodedContent }}></p>
        <div className='w-full text-right text-xs text-white'>
          {(userRole == 'admin' || userId === message.userId) ? 
          <><button className='edit-btn' onClick={() => setIsOpenModal(true)}>
            edit
          </button>
          <button className='delete-btn' onClick={() => setIsDeleteModal(true)}>
            delete
          </button> | </> : null
          }
          <span className='classic-btn bg-[#101010] px-4'>{day}/{month}/{year}</span></div>

        <Modal
          isOpen={isOpenModal}
          onRequestClose={() => setIsOpenModal(false)}
          overlayClassName={'overlay-modal flex items-center justify-center'}
          contentLabel="Edit Message"
          className="p-4 md:modal"
        >
          <EditMessage postData={decodedContent} onSubmit={handleUpdatePost} onClose={() => setIsOpenModal(false)} />
        </Modal>

        {/* Delete message modal */}
        <Modal
          isOpen={isDeleteModal}
          onRequestClose={() => setIsDeleteModal(false)}
          overlayClassName={'overlay-modal flex items-center justify-center'}
          contentLabel="Delete Message"
          className="p-4 md:modal"
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
    setUpdatedContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(updatedContent);
    onClose();
  };

  return (
    <form className='form-modal' method="POST" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={updatedContent}
          onChange={handleChange}
          className='w-full h-48 bg-[#080808] text-white p-2 rounded-md shadow-md'
        />
      </div>
      <button className='create-btn bg-[#265c61] hover:bg-[#1a3739]' type="submit">Edit</button>
    </form>
  );
};

const EditTopic = ({ topicData, onSubmit, onClose }: { topicData: any, onSubmit: (updatedTopicData: { id: string, title: string, body: string, userId: string, gameId: string }) => void, onClose: () => void }) => {
  const [title, setTitle] = useState(topicData.title);
  const [body, setBody] = useState(topicData.body);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedBody = sanitizeInput(body);
    const updatedTopicData = { id: topicData._id, title: sanitizedTitle, body: sanitizedBody, userId: topicData.userId, gameId: topicData.gameId };
    console.log('Submitting updated topic data:', updatedTopicData);
    onSubmit(updatedTopicData);
    onClose();
  };

  return (
    <form className='form-modal' method="POST" onSubmit={handleSubmit}>
      <div>
        <label className='form-label' htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-input'
        />
      </div>
      <div>
        <label className='form-label' htmlFor="body">Body:</label>
        <textarea
          id="body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className='form-textarea'
        />
      </div>
     <button className='create-btn bg-[#265c61] hover:bg-[#1a3739]' type="submit">Submit</button>
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
    <form className='form-modal' method="POST" onSubmit={handleSubmit}>
      <div>
        <label className='form-label' htmlFor="character">Character:</label>
        <select
          id="character"
          name="character"
          value={characterId}
          onChange={handleCharacterChange}
          className='form-input'
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
          className='form-textarea'
        />
      </div>
      <button className='create-btn bg-[#265c61] hover:bg-[#1a3739]' type="submit">Submit</button>
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
      <h2>Delete Message</h2><br/>
      <p>Are you sure you want to delete this message?<br/>
      This action cannot be undone.</p><br/>
      <button className='create-btn bg-red-800 hover:bg-red-950' onClick={handleDeletePost}>Delete</button><br/><br/>
      <button className='create-btn bg-[#265c61] hover:bg-[#1a3739]' onClick={onClose}>Cancel</button>
    </div>
  );
}

export default TopicDetails;