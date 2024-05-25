'use client'
import React, { useEffect, useState } from 'react'
import EditCharacterForm from './components/EditCharacterForm'
import { useCharacter, useDeleteCharacterMutation, useUpdateCharacterMutation } from '@/app/services/characters'
import { FiDelete } from 'react-icons/fi'

const CharacterDetails = () => {
  const [charId, setCharId] = useState('')
  const [gameId, setGameId] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gameId = window.location.pathname.split('/')[2];
      const charId = window.location.pathname.split('/')[4];
      setGameId(gameId)
      setCharId(charId)
    }
  }, [])

  const { data: character, isLoading, isError } = useCharacter(charId)
  const [deleteCharModal, setDeleteCharModal] = useState(false)

  const updateCharMutation = useUpdateCharacterMutation()
  const deleteMutation = useDeleteCharacterMutation()

  const handleUpdateChar = async (updatedCharData: { name:string; image:string; background:string }) => {
    try {
      await updateCharMutation.mutateAsync(updatedCharData);
    } catch (error) {
      console.error('Error updating char data:', error);
    }
  };

  const handleDeleteChar = async () => {
    try {
      await deleteMutation.mutateAsync(charId);
      window.location.href = `/games/${gameId}`;
    } catch (error) {
      console.error('Error deleting char:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>; // Show loading state
  if (isError) return <div>Error fetching character data</div>; // Show error state

  return (
    <div>
      {character && (
        <div>
          {/* Display characters list */}
          <h1>{character.name}</h1>
          <img src={character.image} alt={character.name} />
          <p>{character.background}</p>
          <EditCharacterForm charData={character} onSubmit={handleUpdateChar} />

          <button onClick={() => setDeleteCharModal(!deleteCharModal)}>
            <FiDelete/>
          </button>
        

        {/* Modal for confirmation */}
        {deleteCharModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this game?</p>
              <div>
                <button onClick={handleDeleteChar}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      
    </div>
  )
}

export default CharacterDetails
