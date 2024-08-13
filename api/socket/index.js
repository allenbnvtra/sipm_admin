import { Server } from 'socket.io';
import http from 'http';
import app from './../index.js';
import { decodeAccessToken } from '../helpers/token.js';
import User from '../models/userModel.js';
import { Conversation, Message } from '../models/conversationModel.js';
import {
  getConversation,
  findOrCreateConversation,
} from '../helpers/getConversation.js';

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUsers = new Set();

io.on('connection', async (socket) => {
  console.log('User connected', socket.id);

  const token = socket.handshake.auth.token;
  if (!token) {
    socket.disconnect();
    return;
  }

  try {
    const user = await decodeAccessToken(token);
    if (!user) {
      socket.disconnect();
      return;
    }

    const userId = user.userId.toString();
    socket.join(userId);
    onlineUsers.add(userId);
    io.emit('onlineUser', Array.from(onlineUsers));

    socket.on('message-page', async (userId) => {
      try {
        const userDetails = await User.findById(userId);
        if (!userDetails) return;

        const payload = {
          _id: userDetails._id,
          name: userDetails.name,
          email: userDetails.email,
          online: onlineUsers.has(userId),
        };
        socket.emit('message-user', payload);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    });

    socket.on('send message', async (data) => {
      try {
        let conversation = await findOrCreateConversation(
          data?.sender,
          data?.receiver
        );

        const message = new Message({
          text: data.text,
          msgByUserId: data.msgByUserId,
        });

        const savedMessage = await message.save();
        conversation.messages.push(savedMessage._id);
        await conversation.save();

        const populatedConversation = await Conversation.findById(
          conversation._id
        )
          .populate('messages')
          .sort({ updatedAt: -1 });

        io.to(data.sender).emit(
          'message',
          populatedConversation?.messages || []
        );
        io.to(data.receiver).emit(
          'message',
          populatedConversation?.messages || []
        );

        // Send updated conversations
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);

        io.to(data?.sender).emit('conversation', conversationSender);
        io.to(data?.receiver).emit('conversation', conversationReceiver);
      } catch (error) {
        console.error('Error handling send message:', error);
      }
    });

    // Add this block to handle fetching messages for a specific conversation
    socket.on('get messages', async (data) => {
      try {
        const conversationId = await findOrCreateConversation(
          data?.sender,
          data?.receiver
        );
        const conversation = await Conversation.findById(conversationId)
          .populate('messages')
          .sort({ updatedAt: -1 });

        socket.emit('show messages', conversation?.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    });

    socket.on('message sidebar', async (currentUserId) => {
      try {
        const conversation = await getConversation(currentUserId);
        socket.emit('conversation', conversation);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('onlineUser', Array.from(onlineUsers));
      console.log('User disconnected', socket.id);
    });
  } catch (error) {
    console.error('Error during connection setup:', error);
    socket.disconnect();
  }
});

export default server;
