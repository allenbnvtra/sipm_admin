import express from 'express';
import {
  getMonthlyBill,
  getRecentTransactions,
  getTenantData,
  getUserData,
} from '../controllers/adminWidgetController.js';

const router = express.Router();

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
