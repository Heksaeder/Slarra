// pages/login.tsx
'use client'
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import CreateUserForm from './components/CreateUserForm';

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [animationClass, setAnimationClass] = useState('animate-slide-in');

  const toggleForm = () => {
    setAnimationClass('animate-slide-out');
    setTimeout(() => {
      setIsLoginForm(!isLoginForm);
      setAnimationClass('animate-slide-in');
    }, 100); // Match the duration of your slide out animation
  }

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className={`animate-slide-up`}>
        <h1 className="app-title text-7xl text-center text-white p-8 uppercase">Slarra</h1>
      </div>
      <div className={`flex flex-col items-center justify-center text-white animate-slide-down`}>
        <div className={`w-full max-w-md text-center ${animationClass}`}>
          {isLoginForm ? <LoginForm /> : <CreateUserForm />}
          <button onClick={toggleForm} className="create-btn lowercase text-sm m-0 p-0 bg-[#265c61] hover:bg-[#1a3739] ">{isLoginForm ? 'Create account' : 'Login'}</button>
        </div>
      </div>
    </div>

  );
}

export default Login;
