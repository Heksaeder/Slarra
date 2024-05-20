'use client'
import React, { useEffect, useState } from 'react'
import { useUpdateGameMutation, useDeleteGameMutation } from '@/app/services/games'
import { useFetchGameQuery } from '@/app/services/games'
import EditGameForm from './components/EditGameForm'
import CharacterList from './components/CharactersList'
import AddCharacterForm from './components/AddCharForm'
import { useCharacter, useCreateCharacterMutation } from '@/app/services/characters'

const GamePage = () => {

  const [gameId, setGameId] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gameId = window.location.pathname.split('/')[2];
      setGameId(gameId)
    }
  }, [])

  const { data: game, isLoading, isError } = useFetchGameQuery(gameId);
  const [showModal, setShowModal] = useState(false);

  const updateGameMutation = useUpdateGameMutation(); // Use the mutation hook
  const deleteMutation = useDeleteGameMutation(); // Use the mutation hook

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

  const addCharMutation = useCreateCharacterMutation(); // Use the mutation hook

  const handleAddChar = async (charData: { name: string; image: string; background: string; gameId:string}) => {
    try {
      console.log('Adding character:', charData);
      await addCharMutation.mutateAsync(charData); // Pass charData directly
      console.log('Character added successfully');
    } catch (error) {
      console.error('Error adding character:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      {game && (
        <div>
          {/* Display characters list */}
          <CharacterList gameId={gameId} />
          <h1>{game.title}</h1>
          <img src={game.image} alt={game.title} />
          <p>{game.description}</p>

          {/* Include EditGameForm component */}
          <h2>Edit Game</h2>
          <EditGameForm gameData={game} onSubmit={handleUpdateGame}/>

          <h2>Characters</h2>
          <AddCharacterForm gameId={gameId} onSubmit={handleAddChar} />

          {/* Button to trigger deletion */}
      <button onClick={() => setShowModal(true)}>Delete Game</button>
      {/* Modal for confirmation */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this game?</p>
            <div>
              <button onClick={handleDeleteGame}>Yes, Delete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  )
}

export default GamePage