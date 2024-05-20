'use client'
import { useQuery } from 'react-query';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import CreateUserForm from './components/CreateUserForm';

const Login = () => {

  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  }

  return (
    <div>
      <button onClick={toggleForm}>
        {isLoginForm ? 'Create account' : 'Login'}
      </button>
      {isLoginForm ? <LoginForm /> : <CreateUserForm />}
    </div>
  );
}

export default Login;
