import { AuthProvider } from '@contexts/AuthContext';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login' + location.search);
    }
  }, [location.pathname, navigate]);

  return (
    <AuthProvider>
      <div className={'h-screen w-screen'}>
        <Outlet />
      </div>
      <ToastContainer style={{ width: 'auto' }} />
    </AuthProvider>
  );
};

export default RootLayout;
