// components/CharacterList.tsx
import React from 'react';
import { useCharactersByGame } from '@/app/services/characters';
import Link from 'next/link';

const CharacterList = ({ gameId }: { gameId: string }) => {
  const { data: characters, isLoading, isError } = useCharactersByGame(gameId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading characters</div>;
  }

  return (
    <div>
      <h2>Characters</h2>
      <ul>
        {characters.map((character: any) => (
          
          <li key={character._id}>
            <Link href={`/games/${gameId}/characters/${character._id}`} key={character._id}>
              <h3>{character.name}</h3>
              </Link>
            {character.image && <img src={character.image} alt={character.name} />}
            <p>{character.background}</p>
          </li>
          
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;
