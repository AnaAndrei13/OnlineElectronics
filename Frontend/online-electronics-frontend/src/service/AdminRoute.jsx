import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { role, token } = useContext(AuthContext);

 // Check if the user is authenticated
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if the user has admin role
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';
  
  console.log('Current role:', role);
  console.log('Is admin:', isAdmin);
// If user is not admin, redirect to home page
  if (!isAdmin) {
    console.log('User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

 // If everything is OK, render the protected component
  return children;
};

export default AdminRoute;