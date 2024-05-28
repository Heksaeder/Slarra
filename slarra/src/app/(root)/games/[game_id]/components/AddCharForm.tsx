'use client'
import React, { useState } from 'react';
import { sanitizeInput } from '@/app/lib/purify';

interface AddCharFormProps {
  gameId: string;
  onSubmit: (charData: { name: string; image: string; background: string; gameId:string}) => void;
}

const AddCharForm: React.FC<AddCharFormProps> = ({ gameId, onSubmit }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [background, setBackground] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedName = sanitizeInput(name);
    const sanitizedImage = sanitizeInput(image);
    const sanitizedBackground = sanitizeInput(background);

    onSubmit({ name:sanitizedName, image: sanitizedImage, background: sanitizedBackground, gameId});
  };

  return (
    <form className='form-modal' onSubmit={handleSubmit}>
      <div>
        <label className='form-label' htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='form-input'
          required
        />
      </div>
      <div>
        <label className='form-label' htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className='form-input'
          required
        />
      </div>
      <div>
        <label className='form-label' htmlFor="background">Background:</label>
        <textarea
          id="background"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className='form-textarea'
        />
      </div>
      <button className='create-btn bg-[#265c61] hover:bg-[#1a3739]' type="submit">Add new character</button>
    </form>
  )
}

export default AddCharForm;