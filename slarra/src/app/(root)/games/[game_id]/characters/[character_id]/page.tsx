'use client'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import EditCharacterForm from './components/EditCharacterForm'
import { useCharacter, useDeleteCharacterMutation, useUpdateCharacterMutation } from '@/app/services/characters'
import { FiDelete } from 'react-icons/fi'
import './styles.css'
import { IoIosBrush, IoIosBuild } from 'react-icons/io'
import he from 'he'

const CharacterDetails = () => {
  const [charId, setCharId] = useState('')
  const [gameId, setGameId] = useState('')
  const [editCharModal, setEditCharModal] = useState(false)
  const [deleteCharModal, setDeleteCharModal] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gameId = window.location.pathname.split('/')[2];
      const charId = window.location.pathname.split('/')[4];
      setGameId(gameId)
      setCharId(charId)
    }
  }, [])

  const { data: character, isLoading, isError } = useCharacter(charId)

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

  const decodedBackground = he.decode(character.background);
  character.background = decodedBackground;

  return (
    <div>
      {character && (
        <div>
          {/* Display characters list */}
          <h1 className='bg-[#080808] p-4 fixed top-0 left-0 w-screen z-10' style={{boxShadow:'0px 5px 5px #101010'}}>{character.name}</h1>
          <div className='mt-10'>
          <div className='w-screen h-80 bg-cover bg-center flex flex-row items-end text-2xl' style={{backgroundImage: `url(${character.image})`, backgroundSize:'150%'}}>
            {/* Edit & delete character buttons */}
          <button onClick={() => setEditCharModal(!editCharModal)}><IoIosBrush/></button>
          <button onClick={() => setDeleteCharModal(!deleteCharModal)}>
            <IoIosBuild/>
          </button>
          </div>
          </div>
          <div className='bg-[#080808] m-2 p-2'>
          <p dangerouslySetInnerHTML={{__html:decodedBackground}}></p>
          </div>

          
          {/* Edit character form */}
          <Modal
            isOpen={editCharModal}
            onRequestClose={() => setEditCharModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Edit Topic"
            className="p-4 md:modal"
          >
            <EditCharacterForm charData={character} onSubmit={handleUpdateChar} />
          </Modal>
          
        

        {/* Modal for confirmation */}
        <Modal
            isOpen={deleteCharModal}
            onRequestClose={() => setDeleteCharModal(false)}
            overlayClassName={'overlay-modal flex items-center justify-center'}
            contentLabel="Edit Topic"
            className="p-4 md:modal"
          >
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this character?<br/><br/>
              Every related post will be deleted as well.<br/><br/>
              This action can&apos;t be undone.</p>
              <div>
                <button onClick={handleDeleteChar}>Yes, Delete</button>
                <button onClick={() => setDeleteCharModal(false)}>No, I changed my mind</button>
              </div>
            </Modal>
        </div>
      )}

      
    </div>
  )
}

export default CharacterDetails
