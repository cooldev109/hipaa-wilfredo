import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ForcePasswordChange({ children }) {
  const { user } = useAuth();

  if (user && user.forcePasswordChange) {
    return <Navigate to="/cambiar-contrasena" replace />;
  }

  return children;
}
