import express from 'express';
import { getAllBill } from '../controllers/billsController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';
import { refreshTokenMiddleware } from '../middleware/refreshToken.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin, refreshTokenMiddleware);
router.get('/', getAllBill);

export default router;
