import React from 'react';
import Link from 'next/link';

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
      <Link href={`/games/${game._id}`} key={game._id}>
        <div className='img-box' style={{ backgroundImage: `url(${game.image})` }}></div>
        <h3>{game.title}</h3>
      </Link>
      <p dangerouslySetInnerHTML={{__html:game.description}}></p>
    </div>
  );
};

export default GameBox;
