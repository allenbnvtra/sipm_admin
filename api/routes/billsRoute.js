import express from 'express';
import { getAllBills, getBill } from '../controllers/billsController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.get('/', getAllBills);
router.get('/:billId', getBill);

export default router;
