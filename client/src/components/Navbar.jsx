import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import React,{ useEffect, useState } from 'react';
import BASE_URL from '../utils/api'; // adjust the path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsername(data.name);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('score');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h3>Quiz App</h3>
      <span className="username">Hi, {username}</span>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
