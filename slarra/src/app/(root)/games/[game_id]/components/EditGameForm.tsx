'use client'
// components/EditGameForm.tsx
import React, { useState } from 'react';
import { sanitizeInput } from '@/app/lib/purify';

interface EditGameFormProps {
  gameData: {
    id: string;
    title: string;
    image: string;
    description: string;
  };
  onSubmit: (updatedGameData: { id:string, title: string; image: string; description: string }) => void;
}

const EditGameForm: React.FC<EditGameFormProps> = ({ gameData, onSubmit }) => {
  const [updatedGame, setUpdatedGame] = useState(gameData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedGame({ ...updatedGame, [name]: sanitizeInput(value) });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting updated game data:', updatedGame);
    sanitizeInput(updatedGame.title);
    sanitizeInput(updatedGame.image);
    sanitizeInput(updatedGame.description);
    onSubmit(updatedGame);
  }
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={updatedGame.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={updatedGame.image}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={updatedGame.description}
          onChange={handleChange}
        />
      </div>
      <button type="submit">
        Update Game
      </button>
    </form>
  );
}

export default EditGameForm;
