import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_BASE_API_URL;

const socket: Socket = io(URL, {
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default socket;
