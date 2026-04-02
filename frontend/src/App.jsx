import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Components
import UpdatePrompt from './components/UpdatePrompt';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* GLOBAL UI ELEMENTS */}
      {/* Toaster is positioned to avoid the notch/punch hole */}
      <Toaster 
        position="top-center"
        containerStyle={{
          top: 'calc(env(safe-area-inset-top) + 8px)',
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#3E2723', // bloom-brown-dark
            color: '#FDFDF5',      // bloom-cream
            borderRadius: '1.5rem',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.1)'
          },
        }} 
      />
      
      {/* PWA Update Notification */}
      <UpdatePrompt />

      {/* ROUTING ENGINE */}
      <div className="min-h-screen bg-bloom-cream font-sans selection:bg-bloom-brown selection:text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Private Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Fallback: Redirect any unknown path to login or dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;