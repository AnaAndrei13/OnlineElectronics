import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { role, token } = useContext(AuthContext);

  // Verifică dacă user-ul este autentificat
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Verifică dacă user-ul este admin
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';
  
  console.log('Current role:', role);
  console.log('Is admin:', isAdmin);

  if (!isAdmin) {
    console.log('User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Dacă totul e OK, afișează componenta
  return children;
};

export default AdminRoute;