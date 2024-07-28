import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/sidebar/Sidebar';
import Header from '../components/ui/header/Header';
import MobileNav from '../components/ui/mobileNav/MobileNav';

const ProtectedRoutes: React.FC = () => {
  const user = 'allen';
  return user ? (
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
  ) : (
    <Navigate to='/' />
  );
};

export default ProtectedRoutes;
