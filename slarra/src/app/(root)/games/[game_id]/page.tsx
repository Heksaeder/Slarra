'use client'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { IoPencil } from "react-icons/io5";
import { RxCross2 } from 'react-icons/rx'
import { IoIosAddCircleOutline } from "react-icons/io";

import TopicsList from './components/TopicsList'
import AddTopicForm from './components/AddTopicForm'
import EditGameForm from './components/EditGameForm'
import CharacterList from './components/CharactersList'
import AddCharacterForm from './components/AddCharForm'

import { useUpdateGameMutation, useDeleteGameMutation, useFetchGameQuery } from '@/app/services/games'
import { useCreateCharacterMutation } from '@/app/services/characters'
import { useCreateTopicMutation, useUpdateTopicMutation } from '@/app/services/topics'

import './styles.css'


const GamePage = () => {
  const [gameId, setGameId] = useState('')
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

  const handleAddChar = async (charData: { name: string; image: string; background: string; gameId:string}) => {
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
          <div className='game-header'>
            <div className='game-img' style={{backgroundImage:`url(${game.image})`}}>
              <h1>{game.title}</h1>
              <p className='game-desc'>
                <div className='game-buttons'>
                  <button onClick={() => setIsEditModal(true)}><IoPencil/></button>
                  <button onClick={() => setIsDeleteModal(true)}><RxCross2/></button>
                </div>
              {game.description}</p>
            </div>
          </div>

          {/* Modal for editing game */}
          <Modal
            isOpen={isEditModal}
            onRequestClose={() => setIsEditModal(false)}
            overlayClassName={'overlay-modal'}
            contentLabel="Edit Game"
            className="modal"
          >
            <EditGameForm gameData={game} onSubmit={handleUpdateGame} />
          </Modal>
            
          {/* Modal for deleting game */}
          <Modal
            isOpen={isDeleteModal}
            onRequestClose={() => setIsDeleteModal(false)}
            overlayClassName={'overlay-modal'}
            contentLabel="Delete Game"
            className="modal"
          >
            <div>
              <h2>Are you sure you want to delete this game?</h2>
              <button onClick={handleDeleteGame}>Yes</button>
              <button onClick={() => setIsDeleteModal(false)}>No</button>
            </div>
          </Modal>

          {/* Display characters list */}
          <CharacterList gameId={gameId} />

          {/* Add character button */}
          <button className='add-char-button' onClick={() => setIsAddCharModal(true)}><IoIosAddCircleOutline/></button>
          {/* Add character modal */}
          <Modal
            isOpen={isAddCharModal}
            onRequestClose={() => setIsAddCharModal(false)}
            overlayClassName={'overlay-modal'}
            contentLabel="Add Character"
            className="modal"
          >
            <AddCharacterForm gameId={gameId} onSubmit={handleAddChar} />
          </Modal>

          {/* Display topics */}
          <TopicsList gameId={gameId} />

          {/* Add topic button */}
          <button className='add-char-button' onClick={() => setIsAddTopicModal(true)}><IoIosAddCircleOutline/></button>
          {/* Add topic modal */}
          <Modal
            isOpen={isAddTopicModal}
            onRequestClose={() => setIsAddTopicModal(false)}
            overlayClassName={'overlay-modal'}
            contentLabel="Add Topic"
            className="modal"
          >
            <AddTopicForm gameId={gameId} onSubmit={handleAddTopic}/>
          </Modal>
          
        </div>
      )}
    </div>
  )
}

export default GamePage
