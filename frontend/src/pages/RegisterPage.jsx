import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage () {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    const response = await fetch ('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify ({ username, email, password }),
    });

    const data = await response.json();

    if (data.ok) {
      sessionStorage.setItem('email', email);
      navigate('/otp-verification');
    }

    else
      setError(data.error);
  };

  return (
    <>
    </>
  );
}