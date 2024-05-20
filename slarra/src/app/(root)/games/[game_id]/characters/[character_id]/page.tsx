'use client'
import React, { useEffect, useState } from 'react'
import EditCharacterForm from './components/EditCharacterForm'
import { useCharacter, useUpdateCharacterMutation } from '@/app/services/characters'

const CharacterDetails = () => {

  const [charId, setCharId] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const charId = window.location.pathname.split('/')[4];
      setCharId(charId)
    }
  }, [])

  const {data:character, isLoading, isError} = useCharacter(charId)

  const updateCharMutation = useUpdateCharacterMutation()

  const handleUpdateChar = async (updatedCharData: { name:string; image:string; background:string }) => {
    try {
      console.log('Updating char data:', updatedCharData);
      await updateCharMutation.mutateAsync(updatedCharData); // Pass updatedUserData directly
      console.log('Char data updated successfully');
    } catch (error) {
      console.error('Error updating char data:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      {character && (
        <div>
          {/* Display characters list */}
          <h1>{character.name}</h1>
          <img src={character.image} alt={character.name} />
          <p>{character.background}</p>
          <EditCharacterForm charData={character} onSubmit={handleUpdateChar} />
        </div>
        
      )}
      
    </div>
  )
}

export default CharacterDetails