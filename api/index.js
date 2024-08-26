// index.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// routes
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminWidgetsRoute from './routes/adminWidgetsRoute.js';
import billsRoute from './routes/billsRoute.js';
import tenantRoute from './routes/tenantRoute.js';
import refreshTokenRoute from './routes/refreshTokenRoute.js';
import messagesRoute from './routes/messagesRoute.js';

dotenv.config();

const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL];

    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

// Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(cors(corsConfig));

// Routes
app.use('/api/v1/test', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Test successful. Server is successfully running!',
  });
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/adminWidgets', adminWidgetsRoute);
app.use('/api/v1/bills', billsRoute);
app.use('/api/v1/tenants', tenantRoute);
app.use('/api/v1/refresh', refreshTokenRoute);
app.use('/api/v1/messages', messagesRoute);

app.all('*', function (req, res) {
  return res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} endpoint on this server!`,
  });
});

export default app;
