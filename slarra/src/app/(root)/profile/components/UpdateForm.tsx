'use client'
import { sanitizeInput } from "@/app/lib/purify";
import React, { useState } from 'react';

interface UpdateFormProps {
  userData: {
    id: string;
    name: string;
    email: string;
    bio: string;
  };
  onSubmit: (updatedUserData: { id:string, name: string; email: string; bio: string }) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ userData, onSubmit }) => {
  const [updatedUserData, setUpdatedUserData] = useState(userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: sanitizeInput(value) });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting updated user data:', updatedUserData);
    sanitizeInput(updatedUserData.name);
    sanitizeInput(updatedUserData.email);
    sanitizeInput(updatedUserData.bio);
    onSubmit(updatedUserData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={updatedUserData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={updatedUserData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={updatedUserData.bio}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateForm;
