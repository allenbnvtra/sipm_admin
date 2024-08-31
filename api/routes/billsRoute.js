import express from 'express';
import {
  addNewBill,
  billPayment,
  getAllBills,
  getBill,
  getBillTransactions,
} from '../controllers/billsController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.get('/', getAllBills);
router.get('/:billId', getBill);
router.get('/:billId/transactions', getBillTransactions);
router.post('/:billId/payment', billPayment);
router.post('/:userId/newBill', addNewBill);

export default router;
