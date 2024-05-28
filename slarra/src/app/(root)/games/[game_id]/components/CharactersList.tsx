// components/CharacterList.tsx
import React, { useState } from 'react';
import { useCharactersByGame } from '@/app/services/characters';
import Link from 'next/link';
import Modal from 'react-modal';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CharacterList = ({ gameId }: { gameId: string }) => {
  const { data: characters, isLoading, isError } = useCharactersByGame(gameId);
  const [isListVisible, setIsListVisible] = useState(true);

  const toggleListVisibility = () => {
    setTimeout(() => {
      setIsListVisible(!isListVisible);
    }, 100);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching characters</div>;


  return (
    <>
      <h2 className="sticky z-10">
        <button onClick={toggleListVisibility} className="text-xl mr-4">
          {isListVisible ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        Characters
      </h2>
      <div
        className={`${
          isListVisible ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } transition-all duration-500 ease-in-out overflow-y-auto w-full`}
      >
        <div className="flex h-full py-4 xl:py-0 w-full xl:flex-col">
          {characters.map((character: any) => (
            <div className="flex flex-row flex-shrink-0 justify-center items-center w-1/3 h-full md:w-1/4 md:items-center md:justify-center xl:w-full lg:h-1/6 lg:flex-col" key={character._id}>
              <Link href={`/games/${gameId}/characters/${character._id}`} key={character._id} className='md:w-full'>
                {character.image && (
                  <div
                    className="flex flex-col justify-center rounded-full w-32 h-32 bg-cover bg-center md:w-[25vw] md:rounded-none md:border-x-2 md:border-black xl:w-full"
                    style={{ backgroundImage: `url(${character.image})`, backgroundSize: '230%' }}
                  >
                    <h3
                      className="uppercase text-center md:p-4 md:font-extrabold md:text-2xl md:bg-transparent md:text-white md:text-shadow-2px-2px-0px-black"
                      style={{ textShadow: '2px 2px 0px black' }}
                    >
                      {character.name}
                    </h3>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CharacterList;
