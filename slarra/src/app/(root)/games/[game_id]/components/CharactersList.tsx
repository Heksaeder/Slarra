// components/CharacterList.tsx
import React from 'react';
import { useCharactersByGame } from '@/app/services/characters';
import Link from 'next/link';

const CharacterList = ({ gameId }: { gameId: string }) => {
  const { data: characters, isLoading, isError } = useCharactersByGame(gameId);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching characters</div>;
  
  return (
    <>
  <h2>Characters</h2>
    <div className='char-flex'>
        {characters.map((character: any) => (
            <div className='char-box' key={character._id}>
              <Link href={`/games/${gameId}/characters/${character._id}`} key={character._id}>
                <h3>{character.name}</h3>
                {character.image && <div className='img-box' style={{backgroundImage: `url(${character.image})`}}></div>}
              </Link>
            </div>
        ))}
    </div>
    </>
  );
};

export default CharacterList;
