import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register'; // Import the new page
import Dashboard from './pages/Dashboard'; // Import Dashboard

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Toaster 
        toastOptions={{
          className: 'border border-bloom-brown/10',
          success: {
            iconTheme: {
              primary: '#6D4C41', // bloom-brown
              secondary: '#FDFDF5', // bloom-cream
            },
          },
          error: {
            iconTheme: {
              primary: '#E57373', // Muted red for errors
              secondary: '#fff',
            },
          },
        }} 
      />
      <div className="bg-bloom-cream min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// Inside your Routes in App.jsx:
