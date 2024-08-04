// src/SocketContext.tsx
import { createContext, ReactNode } from 'react';
import socket from './socket';
import { Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextProps>({ socket });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
