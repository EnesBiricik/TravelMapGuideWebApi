import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:7018/api/User/Login', {
        username,
        password
      });

      if (response.status === 200) {
        localStorage.setItem('jwtToken', response.data.token);
        history('/');
      }
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };


  return (
    <div className="login-container" style={{backgroundColor: "rgb(33, 33, 33)"}}>
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <input
              type="text"
              id="username"
              className="login-input"
              value={username}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <input
              type="password"
              id="password"
              placeholder='Password'
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>

  );
}

export default Login;
