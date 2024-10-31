/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/auth.css';
import { API_ENDPOINTS } from '../constants/Endpoints';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_ENDPOINTS.DEFAULT_URL}api/User/Login`, {
        username,
        password
      });

      if (response.status === 200) {
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };

  const handleSignup = () => {
    navigate('/Signup')
  }

  return (
    <div className="auth-container" style={{backgroundColor: "rgb(33, 33, 33)"}}>
      <div className="login-form">
        <h2 className='auth-header'>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              id="username"
             className="form-control"
              value={username}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
          <label>Password:</label>
            <input
              type="password"
              id="password"
              placeholder='Password'
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="btn btn-primary"><b>Sign In</b></button>
          <p className='auth-route' onClick={() => handleSignup()}>Do not have an account? Sign up</p>
        </form>
      </div>
    </div>

  );
}

export default Login;
