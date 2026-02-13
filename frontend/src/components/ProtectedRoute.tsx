import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // We will build this next

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};