import express from 'express';
import { getAllBill } from '../controllers/billsController.js';

const router = express.Router();

router.get('/', getAllBill);

export default router;
