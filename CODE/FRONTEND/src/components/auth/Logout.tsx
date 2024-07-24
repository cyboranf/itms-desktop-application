// Logout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './auth'; // Zakładam, że auth.ts jest w tym samym katalogu
import { logoutUser } from '../../service/auth';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    logoutUser();
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
