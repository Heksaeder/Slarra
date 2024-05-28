'use client'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { IoPencil } from "react-icons/io5";
import { RxCross2 } from 'react-icons/rx'
import { IoIosAddCircleOutline, IoIosBrush, IoIosBuild } from "react-icons/io";

import TopicsList from './components/TopicsList'
import AddTopicForm from './components/AddTopicForm'
import EditGameForm from './components/EditGameForm'
import CharacterList from './components/CharactersList'
import AddCharacterForm from './components/AddCharForm'

import { useUpdateGameMutation, useDeleteGameMutation, useFetchGameQuery } from '@/app/services/games'
import { useCreateCharacterMutation } from '@/app/services/characters'
import { useCreateTopicMutation, useUpdateTopicMutation } from '@/app/services/topics'

import './styles.css'
import { useFetchUserQuery } from '@/app/services/users';
import { getUserIdFromToken } from '@/app/services/auth';


const GamePage = () => {
  const [gameId, setGameId] = useState('')
  const userId = getUserIdFromToken();
  const [isEditModal, setIsEditModal] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [isAddCharModal, setIsAddCharModal] = useState(false)
  const [isAddTopicModal, setIsAddTopicModal] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gameId = window.location.pathname.split('/')[2];
      setGameId(gameId)
    }
  }, [])

  const { data: game, isLoading, isError } = useFetchGameQuery(gameId);
  const {data: userData, isLoading:userLoading, isError:userError} = useFetchUserQuery(userId as string); // Get user from context

  const updateGameMutation = useUpdateGameMutation(); // Use the mutation hook
  const deleteMutation = useDeleteGameMutation(); // Use the mutation hook
  const addCharMutation = useCreateCharacterMutation(); // Use the mutation hook
  const addTopicMutation = useCreateTopicMutation(); // Use the mutation hook



  const handleUpdateGame = async (updatedGameData: { id: string, title: string; image: string; description: string }) => {
    try {
      console.log('Updating game data:', updatedGameData);
      await updateGameMutation.mutateAsync(updatedGameData); // Pass updatedUserData directly
      console.log('Game data updated successfully');
    } catch (error) {
      console.error('Error updating game data:', error);
    }
  };

  const handleDeleteGame = async () => {
    try {
      await deleteMutation.mutateAsync(gameId); // Trigger the delete mutation
      // Redirect to login page
      window.location.href = '/games';
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddChar = async (charData: { name: string; image: string; background: string; gameId: string }) => {
    try {
      await addCharMutation.mutateAsync(charData); // Pass charData directly
    } catch (error) {
      console.error('Error adding character:', error);
    }
  };

  const handleAddTopic = async (topicData: { title: string; body: string; gameId: string }) => {
    try {
      await addTopicMutation.mutateAsync(topicData); // Pass topicData directly
      console.log('Topic added successfully', topicData);
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };


  if (isLoading) return <div> </div>; // Show loading state
  if (isError) return <div> </div>; // Show error state

  return (
    <div>
      {game && (
        <div>
          <div className='flex flex-col h-[20dvh] sticky w-full z-40 xl:flex-row xl:w-1/6 xl:absolute'>
            <div className='flex flex-col items-center justify-center h-full bg-cover p-4 bg-center xl:h-screen xl:w-full' style={{ backgroundImage: `url(${game.image})` }}>
              <h1 className='text-4xl lg:text-6xl font-extrabold uppercase shadow-black absolute transform xl:-rotate-90 transition-transform duration-300' style={{ textShadow: '2px 2px 1px black' }}>{game.title}</h1>
              <p className='hidden lg:game-desc lg:flex'>{game.description}</p>
              <div className='absolute bottom-0 text-right lg:text-2xl top-0 right-0 m-4 xl:bottom-0 xl:left-0'>
                <button className='p-2 rounded-full' onClick={() => setIsEditModal(true)}><IoIosBrush /></button>
                <button className='p-2 rounded-full' onClick={() => setIsDeleteModal(true)}><IoIosBuild /></button>
              </div>
            </div>
          </div>

          <div className='xl:flex-row xl:flex xl:w-full xl:justify-end'>
            <div className='xl:flex xl:flex-col xl:w-1/6 xl:max-h-screen'>
              {/* Add character button */}
              <button className='absolute z-40 right-0 m-3 text-2xl' onClick={() => setIsAddCharModal(true)}><IoIosAddCircleOutline /></button>
              {/* Display characters list */}
              <CharacterList gameId={gameId}/>
            </div>
            <div className='xl:flex xl:flex-col xl:w-4/6'>
              {/* Add topic button */}
              <button className='absolute right-0 m-3 text-2xl z-40' onClick={() => setIsAddTopicModal(true)}><IoIosAddCircleOutline /></button>
              {/* Display topics */}
              <TopicsList gameId={gameId} userName={userData.name} /></div>
          </div>
          {/* -------------------------------------------------------- MODAUX -------------------------------------------------------------*/}
          {/* Add character modal */}
          <Modal
            isOpen={isAddCharModal}
            onRequestClose={() => setIsAddCharModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Add Character"
            className="p-4 md:modal"
          >
            <AddCharacterForm gameId={gameId} onSubmit={handleAddChar} />
          </Modal>

          {/* Modal for editing game */}
          <Modal
            isOpen={isEditModal}
            onRequestClose={() => setIsEditModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Edit Game"
            className="p-4 md:modal"
          >
            <EditGameForm gameData={game} onSubmit={handleUpdateGame} />
          </Modal>

          {/* Modal for deleting game */}
          <Modal
            isOpen={isDeleteModal}
            onRequestClose={() => setIsDeleteModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Delete Game"
            className="p-4 md:modal"
          >
            <div>
              <h2>Are you sure you want to delete this game?</h2>
              <button onClick={handleDeleteGame}>Yes</button>
              <button onClick={() => setIsDeleteModal(false)}>No</button>
            </div>
          </Modal>



          {/* Add topic modal */}
          <Modal
            isOpen={isAddTopicModal}
            onRequestClose={() => setIsAddTopicModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Add Topic"
            className="p-4 md:modal"
          >
            <AddTopicForm gameId={gameId} onSubmit={handleAddTopic} />
          </Modal>

        </div>
      )}
    </div>
  )
}

export default GamePage
