import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/sidebar/Sidebar';
import Header from '../components/ui/header/Header';
import MobileNav from '../components/ui/mobileNav/MobileNav';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { io, Socket } from 'socket.io-client';
import { setSocketConnection } from '../redux/slices/userSlice';

const ProtectedRoutes: React.FC = () => {
  const token = useAppSelector((state) => state.user.token);
  const isAuthenticated = !!token;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const socketConnection: Socket = io(import.meta.env.VITE_BASE_API_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketConnection.on('onlineUser', (data) => {
      console.log(data);
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='flex bg-gray-100'>
      <Sidebar />
      <div className='w-full'>
        <Header />
        <div className='bg-gray-100 p-3 md:px-[3rem]'>
          <Outlet />
        </div>
        <div className='sticky bottom-0'>
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoutes;
