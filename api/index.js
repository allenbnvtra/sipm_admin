// packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// routes
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminWidgetsRoute from './routes/adminWidgetsRoute.js';
import billsRoute from './routes/billsRoute.js';
import tenantRoute from './routes/tenantRoute.js';

dotenv.config({});

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/adminWidgets', adminWidgetsRoute);
app.use('/api/v1/bills', billsRoute);
app.use('/api/v1/tenants', tenantRoute);

app.all('*', function (req, res) {
  return res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} endpoint on this server!`,
  });
});

export default app;
