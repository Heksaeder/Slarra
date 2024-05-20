import React from 'react';
import { useRouter } from 'next/navigation';

interface GameBoxProps {
  game: {
    _id: string;
    title: string;
    description: string;
    image: string;
  };
}

const GameBox: React.FC<GameBoxProps> = ({ game }) => {
  return (
    <div className="game-box">
      <img src={game.image} alt={game.title} />
      <h3>{game.title}</h3>
      <p>{game.description}</p>
    </div>
  );
};

export default GameBox;
