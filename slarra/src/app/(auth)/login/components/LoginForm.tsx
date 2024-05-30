// components/LoginForm.tsx
import { useState } from "react";
import { useLoginMutation } from "@/app/services/users";
import '../styles.css'
import { login } from "@/app/services/auth";

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
    <form method="POST" onSubmit={handleSubmit} className="mb-4 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="form-label block text-white text-sm mb-2 lowercase" htmlFor="email">
          Email
        </label>
        <input
          className="form-input"
          id="email"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
        />
      </div>
      <div className="mb-6">
        <label className="form-label block text-white text-sm mb-2 lowercase" htmlFor="password">
          Password
        </label>
        <input
          className="form-input"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loginMutation.isLoading}
          className="create-btn lowercase text-sm m-0 p-0 bg-yellow-700 hover:bg-yellow-900"
        >
          {loginMutation.isLoading ? 'Logging in...' : 'Login'}
        </button><br/>
        {loginMutation.isError && 
          <div className="text-red-500 text-sm">
            {loginMutation.error?.message}
            </div>
            }
      </div>
    </form>
  );
}

export default LoginForm;
