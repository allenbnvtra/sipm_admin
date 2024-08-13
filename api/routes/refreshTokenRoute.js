import express from 'express';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../helpers/token.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const refreshToken = req.cookies.token;
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    const userData = verifyRefreshToken(refreshToken);
    if (!userData) {
      return res
        .status(403)
        .json({ message: 'Invalid or expired refresh token' });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(userData.userId);
    const newRefreshToken = generateRefreshToken(userData.userId);

    res.cookie('token', newRefreshToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('accessToken', newAccessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error processing refresh token:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
