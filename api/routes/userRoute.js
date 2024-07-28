import express from 'express';

import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin-data', isAuthenticated, isAdmin, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'This is admin data.',
      data: req.user,
    },
  });
});

export default router;
