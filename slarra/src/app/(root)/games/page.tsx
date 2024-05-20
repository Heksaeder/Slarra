'use client'
import React from 'react'
import { useAddGameMutation, useFetchGamesQuery } from '../../services/games';
import GameBox from './components/GameBox'
import AddGameForm from './components/AddGameForm';
import './styles.css';
import Link from 'next/link';

const Games:React.FC = () => {
  const { data: games, isLoading, isError } = useFetchGamesQuery();
  const addGameMutation = useAddGameMutation();

  const handleAddGame = (newGame: { title: string; image: string; description: string }) => {
    addGameMutation.mutate(newGame);
  };


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching games</div>
  }

  return (
    <div className='container'>
      <h1>My Games</h1>
      <div className='gameGrid'>
        {games.map((game: any) => (
          <Link href={`/games/${game._id}`} key={game._id}>
            <GameBox key={game._id} game={game} />
          </Link>
        ))}
      </div>
      <h2>Add a New Game</h2>
      <AddGameForm onSubmit={handleAddGame} />
    </div>
  );
}

export default Games