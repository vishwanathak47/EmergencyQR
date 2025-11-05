import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On mount, if we have a fallback token in localStorage, mark authenticated.
    try {
      const tok = localStorage.getItem('auth_token');
      if (tok) setIsAuthenticated(true);
    } catch (e) { }
  }, []);

  async function login(email, password) {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, { email, password }, { withCredentials: true });
    setIsAuthenticated(true);
    setUser(res.data.user);
    // store token fallback for environments where httpOnly cookies are blocked
    if (res.data.token) {
      try { localStorage.setItem('auth_token', res.data.token); } catch (e) { }
    }
    // set default Authorization header for axios so protected API calls succeed when cookie not used
    try {
      const token = res.data.token || localStorage.getItem('auth_token');
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (e) { }
    return res.data;
  }

  async function signup(email, password) {
    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, { email, password }, { withCredentials: true });
    setIsAuthenticated(true);
    setUser(res.data.user);
    if (res.data.token) {
      try { localStorage.setItem('auth_token', res.data.token); } catch (e) { }
    }
    try {
      const token = res.data.token || localStorage.getItem('auth_token');
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (e) { }
    return res.data;
  }

  async function logout() {
    // clear cookie by calling a server endpoint or just clear client state
    setIsAuthenticated(false);
    setUser(null);
    try { localStorage.removeItem('auth_token'); } catch (e) { }
    try { await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {}, { withCredentials: true }); } catch (e) { }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
