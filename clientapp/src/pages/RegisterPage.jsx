import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password });
      setSuccessMessage(response.data.message);
      setError(null);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-bold mb-4">Register</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username:</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-blue-500" required />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
