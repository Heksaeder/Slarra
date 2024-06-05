// components/CreateUserForm.tsx

import { useState } from "react";
import { useRegisterMutation } from "../../../services/users";
import '../styles.css';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const createUserMutation = useRegisterMutation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUserMutation.mutate(formData as any);
    // Show account creation message
    alert("Your account has been created!");
  };

  return (
    <form method="POST" onSubmit={handleSubmit} className="mb-4 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="form-input"
          id="name"
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="form-input"
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="form-input"
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={createUserMutation.isLoading}
          className="form-button"
        >
          {createUserMutation.isLoading ? 'Creating...' : 'Sign up!'}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
