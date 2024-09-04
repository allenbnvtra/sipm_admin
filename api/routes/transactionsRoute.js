import express from 'express';
import { getTransactionById } from '../controllers/transactionsController.js';

const router = express.Router();

router.get('/:transactionId', getTransactionById);

export default router;
