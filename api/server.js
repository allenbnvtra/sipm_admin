import app from './index.js';
import server from './socket/index.js';
import connectDB from './config/database.js';
import morgan from 'morgan';

import dotenv from 'dotenv';
dotenv.config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTIONS! THE SERVER IS SHUTTING DOWN⛔☠️ ⛔');
  console.log(err.message, err.stack);
  process.exit(1);
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// SERVER
const PORT = process.env.PORT || 51004;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at: http://localhost:${PORT}`);
});

// Error server rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, ' : ', err.message);
  console.log('Shutting down the server because of Unhandled Rejection');

  server.close(() => {
    process.exit(1);
  });
});
