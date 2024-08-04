import express from 'express';
import {
  getAllTenants,
  getTenant,
  getTenantBill,
} from '../controllers/tenantController.js';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';
import { refreshTokenMiddleware } from '../middleware/refreshToken.js';

const router = express.Router();

router.use(isAuthenticated, isAdmin, refreshTokenMiddleware);
router.get('/', getAllTenants);
router.get('/:tenantId', getTenant);
router.get('/:tenantId/bill', getTenantBill);

export default router;
