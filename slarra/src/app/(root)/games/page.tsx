'use client'
import React from 'react'
import Modal from 'react-modal'
import { useAddGameMutation, useFetchGamesQuery } from '../../services/games';
import GameBox from './components/GameBox'
import AddGameForm from './components/AddGameForm';
import './styles.css';
import Link from 'next/link';

const Games: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const { data: games, isLoading, isError } = useFetchGamesQuery();
  const addGameMutation = useAddGameMutation();

  const handleAddGame = (newGame: { title: string; image: string; description: string }) => {
    addGameMutation.mutate(newGame);
  };

  if (isLoading) return <div> </div>; // Show loading state
  if (isError) return <div> </div>; // Show error state

  return (
    <div className='container'>
      <h1>My Games</h1>
      <div className='gameGrid'>
        {games.map((game: any) => (
          <GameBox key={game._id} game={game} />
        ))}
      </div>
      <h2>Add a New Game</h2>
      <button onClick={() => setIsOpenModal(true)}>Add Game</button>
      <Modal
        isOpen={isOpenModal}
        onRequestClose={() => setIsOpenModal(false)}
        overlayClassName={'overlay-modal'}
        contentLabel="Add Game"
        className="modal"
        >
      <AddGameForm onSubmit={handleAddGame} onClose={() => setIsOpenModal(false)} />
      </Modal>
    </div>
  );
}

export default Games;
