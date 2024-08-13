import jwt from 'jsonwebtoken';

export const verifyRefreshToken = (token) => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.error('Invalid or expired refresh token:', error.message);
    return null;
  }
};

export const decodeAccessToken = async (token) => {
  try {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET environment variable is not set');
    }
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    console.error('Invalid or expired refresh token:', error.message);
    return null;
  }
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
