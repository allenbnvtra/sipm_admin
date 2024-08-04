import { Server } from 'socket.io';
import http from 'http';
import app from './../index.js';

const server = http.createServer(app);

// Socket.io

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });
});

export default server;
