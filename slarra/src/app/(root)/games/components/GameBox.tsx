import React, { useState } from 'react';
import Link from 'next/link';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleClick = (e:any) => {
    e.preventDefault();
    setIsAnimating(true);

    setTimeout(() => {
      router.push(`/games/${game._id}`);
    }, 1500); // Duration matches the animation duration
  };

  return (
    <div className="game-box">
        <div
          className={`w-screen h-[25dvh] lg:border-x-2 border-black lg:h-screen lg:w-[25dvw] lg:flex lg:flex-row bg-cover bg-center flex flex-col justify-center items-center ${isAnimating ? 'fullscreen' : ''}`}
          style={{ backgroundImage: `url(${game.image})` }}
        ><Link href={`/games/${game._id}`} onClick={handleClick}>
          <h2 className='game-title text-white text-4xl font-extrabold uppercase p-4 bg-transparent lg:text-6xl' style={{ textShadow: '1px 1px 2px black' }}>
            {game.title}
          </h2></Link>
        </div>
      <p className='hidden' dangerouslySetInnerHTML={{ __html: game.description }}></p>
    </div>
  );
};

export default GameBox;
