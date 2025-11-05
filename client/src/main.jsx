import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ContactFormPage from './pages/ContactFormPage';
import ScanPage from './pages/ScanPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthProvider from './context/AuthContext';
import Navbar from './components/Navbar';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/form" element={<ProtectedRoute><ContactFormPage /></ProtectedRoute>} />
          <Route path="/scan/:id" element={<ScanPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
