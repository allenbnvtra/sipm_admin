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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    const socketConnection: Socket = io(import.meta.env.VITE_BASE_API_URL, {
      auth: {
        token: token,
      },
    });

    socketConnection.on('onlineUser', (data) => {
      data;
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch, token]);

  if (!token) {
    return null;
  }

  return (
    <div className='flex bg-[#e5e9e9]'>
      <Sidebar />
      <div className='w-full'>
        <Header />
        <div className='bg-[#e5e9e9] p-3 md:px-[3rem]'>
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
