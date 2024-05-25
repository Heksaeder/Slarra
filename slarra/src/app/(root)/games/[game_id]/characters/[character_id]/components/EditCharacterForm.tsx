import React, { useState } from 'react';
import { useUpdateCharacterMutation } from '@/app/services/characters';

interface EditCharFormProps {
  charData: {
    name: string;
    image: string;
    background: string;
  };
  onSubmit: (updatedGameData: { name: string; image: string; background: string }) => void;
}
const EditCharacterForm: React.FC<EditCharFormProps> = ({ charData, onSubmit}) => {
  const [updatedCharacter, setUpdatedCharacter] = useState(charData);

  const updateCharacterMutation = useUpdateCharacterMutation();

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUpdatedCharacter({ ...updatedCharacter, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(updatedCharacter);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={updatedCharacter.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={updatedCharacter.image}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="background">Background:</label>
        <textarea
          id="background"
          name="background"
          value={updatedCharacter.background}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditCharacterForm;
