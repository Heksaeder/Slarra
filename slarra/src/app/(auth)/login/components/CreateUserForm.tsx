import { useState } from "react";
import { useRegisterMutation } from "../../../services/users";

const CreateUserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const createUserMutation = useRegisterMutation();
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUserMutation.mutate(formData);
  }

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} /><br />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} /><br />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
      <button type="submit" disabled={createUserMutation.isLoading}>
        {createUserMutation.isLoading ? 'Filling...' : 'Sign up!'}
      </button>
    </form>
  );
}

export default CreateUserForm;