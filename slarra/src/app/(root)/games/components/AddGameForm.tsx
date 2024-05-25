import React, { useState } from 'react';
import { sanitizeInput } from '@/app/lib/purify';

interface AddGameFormProps {
  onSubmit: (gameData: { title: string; image: string; description: string }) => void;
  onClose: () => void;
}

const AddGameForm: React.FC<AddGameFormProps> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedImage = sanitizeInput(image);
    const sanitizedDescription = sanitizeInput(description);
    onSubmit({ title:sanitizedTitle, image:sanitizedImage, description:sanitizedDescription});
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Add Game</button>
    </form>
  );
};

export default AddGameForm;
