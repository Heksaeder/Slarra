'use client'
import React, { useState } from 'react';
import { sanitizeInput } from '@/app/lib/purify';

interface AddTopicFormProps {
  gameId: string;
  onSubmit: (topicData: { title: string; gameId: string; body: string;}) => void;
}

const AddTopicForm: React.FC<AddTopicFormProps> = ({ gameId, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedBody = sanitizeInput(body);

    onSubmit({ title:sanitizedTitle, gameId, body: sanitizedBody});
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
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button type="submit">Add Topic</button>
    </form>
  )
}

export default AddTopicForm;