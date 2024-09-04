import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/sidebar/Sidebar';
import Header from '../components/ui/header/Header';
import MobileNav from '../components/ui/mobileNav/MobileNav';
import { useAppDispatch } from '../redux/hooks';
import { io, Socket } from 'socket.io-client';
import { setSocketConnection } from '../redux/slices/userSlice';

const ProtectedRoutes: React.FC = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
  }, []);

  useEffect(() => {
    const socketConnection: Socket = io(import.meta.env.VITE_BASE_API_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketConnection.on('onlineUser', (data) => {
      data;
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

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
