import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/sidebar/Sidebar';
import Header from '../components/ui/header/Header';
import MobileNav from '../components/ui/mobileNav/MobileNav';
import { SocketProvider } from '../socket/socketContext';
import { useAppSelector } from '../redux/hooks';
import { isTokenExpired } from './tokenUtils';

const ProtectedRoutes: React.FC = () => {
  const token = useAppSelector((state) => state.user.token);
  const isAuthenticated = token && !isTokenExpired(token);

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <SocketProvider>
      <div className='flex bg-gray-100'>
        <Sidebar />
        <div className='w-full'>
          <Header />
          <div className='bg-gray-100 p-3 md:px-6'>
            <Outlet />
          </div>
          <div className='sticky bottom-0'>
            <MobileNav />
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default ProtectedRoutes;
