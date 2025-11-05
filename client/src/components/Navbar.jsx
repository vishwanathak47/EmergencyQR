import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar(){
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">Emergency QR</Link>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          {!isAuthenticated && <Link to="/signup">Signup</Link>}
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {isAuthenticated && <Link to="/form">Form</Link>}
          {isAuthenticated && user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
          {isAuthenticated && <button onClick={() => { logout(); navigate('/'); }}>Logout</button>}
          <button onClick={() => setDark(d => !d)} className="ml-2">{dark ? 'Light' : 'Dark'}</button>
        </div>
      </div>
    </nav>
  );
}
