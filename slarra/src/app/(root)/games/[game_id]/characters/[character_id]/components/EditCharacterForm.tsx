import he from 'he';
import React, { useState } from 'react';

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

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUpdatedCharacter({...updatedCharacter, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(updatedCharacter);
  }

  return (
    <form className='form-modal' onSubmit={handleSubmit}>
      <div>
        <label className='form-label' htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={updatedCharacter.name}
          onChange={handleChange}
          className='form-input'
          required
        />
      </div>
      <div>
        <label className='form-label' htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={updatedCharacter.image}
          onChange={handleChange}
          className='form-input'
          required
        />
      </div>
      <div>
        <label className='form-label' htmlFor="background">Background:</label>
        <textarea
          id="background"
          name="background"
          value={updatedCharacter.background}
          onChange={handleChange}
          className='form-textarea'
        />
      </div>
      <button className='create-btn bg-[#265c61] hover:bg-[#1a3739]' type="submit">Save</button>
    </form>
  );
};

export default EditCharacterForm;
