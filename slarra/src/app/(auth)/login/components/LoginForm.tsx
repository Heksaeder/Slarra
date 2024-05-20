import { useState } from "react";
import { useMutation } from "react-query";
import axiosConfig from "../../../lib/axios.config";
import { useLoginMutation } from "../../../services/users";
import Cookies from 'js-cookie';

const LoginForm = () => {

  const [formData, setFormData] = useState({ email: '', password: '' });

  const loginMutation = useLoginMutation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: any) => {


    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        window.location.href = '/';
      },
      onError: (error: any) => {
        setFormData({ email: '', password: '' });
      }
    });
  }

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} /><br />
      <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} /><br />
      <button type="submit" disabled={loginMutation.isLoading}>
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm;