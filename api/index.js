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
import User from './models/userModel.js';
import { generateAccessToken, generateRefreshToken } from './helpers/token.js';

dotenv.config({});

const app = express();

// Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ensure this is correct
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/v1/test', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Test successful. Server is successfully running!',
  });
});

app.use('/api/v1/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    // Find the user
    const user = await User.findOne({
      email,
      active: true,
      role: 'admin',
    }).select('+password +loginAttempts +lockUntil +role');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // Check if the account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(429).json({
        status: 'fail',
        message: 'Account locked. Please try again later.',
      });
    }

    // Verify password and user status
    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      await handleFailedLogin(user);
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // Reset login attempts and lockUntil
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Generate JWT token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('token', refreshToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('accessToken', accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      status: 'success',
      accessToken,
      result: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});
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
