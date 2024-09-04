import express from 'express';
import { getTransactionById } from '../controllers/transactionsController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin);
router.get('/:transactionId', getTransactionById);

export default router;
