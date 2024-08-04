import jwt from 'jsonwebtoken';

// Middleware to refresh the token
export const refreshTokenMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for the token in authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token provided.',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token.',
      });
    }

    // Ensure req.user is set by previous authentication middleware
    const currentUser = req.user;
    if (!currentUser || currentUser._id.toString() !== decoded.userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User does not match token.',
      });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: currentUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30m' } // 30 minutes
    );

    // Set the new access token in the cookie
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 30 * 60 * 1000,
    });

    // Optionally, you might want to set a new refresh token as well
    // const newRefreshToken = jwt.sign(
    //   { userId: currentUser._id },
    //   process.env.JWT_REFRESH_SECRET,
    //   { expiresIn: '7d' } // 7 days
    // );

    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({
      status: 'fail',
      message: 'Could not refresh token.',
    });
  }
};
