import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    // If no session exists, redirect to login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;