import { generateAccessToken, generateRefreshToken } from '../helpers/token.js';
import User from '../models/userModel.js';

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

// Function to handle failed login attempts
const handleFailedLogin = async (user) => {
  user.loginAttempts += 1;
  if (user.loginAttempts >= MAX_ATTEMPTS) {
    user.lockUntil = Date.now() + LOCK_TIME;
  }
  await user.save();
};

// Login handler
export const login = async (req, res) => {
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
};

// Logout handler
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie('token', '', { maxAge: 0 }).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
