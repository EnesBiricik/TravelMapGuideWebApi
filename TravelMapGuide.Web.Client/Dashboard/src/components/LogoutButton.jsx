import React from 'react';
import { useHistory } from 'react-router-dom';

export const LogoutButton = () => {
  const history = useHistory();
  const token = localStorage.getItem('jwtToken');

  const handleLogout = async () => {
    try {
      
      await fetch('https://localhost:7018/api/User/Logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
        localStorage.removeItem('jwtToken');
        history.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div onClick={handleLogout}>
      <span>Log out</span>
    </div>
  );
};

export default LogoutButton;
