import express from 'express';
import {
  getMonthlyBill,
  getRecentTransactions,
  getTenantData,
  getUserData,
} from '../controllers/adminWidgetController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';
import { refreshTokenMiddleware } from '../middleware/refreshToken.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin, refreshTokenMiddleware);
router.get('/getWidgetData', getUserData);
router.get('/getTenantData', getTenantData);
router.get(
  '/getRecentTransaction',

  getRecentTransactions
);
router.get(
  '/getMonthlyBill',

  getMonthlyBill
);

export default router;
