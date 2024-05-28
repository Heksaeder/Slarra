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
  const [updatedUserData, setUpdatedUserData] = useState({ ...userData });

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

  console.log(userData);

  return (
    <form className="form-modal p-4 rounded-lg shadow-lg" onSubmit={handleSubmit}>
      <div className="my-4">
        <label className="form-label" htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={updatedUserData.name}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="my-4">
        <label className="form-label" htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={updatedUserData.email}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="my-4">
        <label className="form-label" htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={updatedUserData.bio}
          onChange={handleChange}
          className="form-textarea"
        />
      </div>
      <button className="create-btn bg-[#276969] active:bg-[#1a3729] " type="submit">Update</button>
    </form>
  );
};

export default UpdateForm;
